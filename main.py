#!/usr/bin/env python3

import datetime
import json
import logging
import signal
import sqlite3
import sys
from threading import Condition, Event, Thread
from time import sleep

from flask import (Flask, Response, jsonify, render_template, request,
                   send_from_directory, url_for)
from werkzeug.serving import make_server

CURRENT_READING  =  {"temp": 0, "hum": 0, "lux": 0, "pres": 0, "trend": ""}
GRAPH_VALUES     =  {"temp": [], "hum": [], "lux": [], "pres": [], "time": []}
MIN_MAX          =  {"temp": [0, 0], "hum": [0, 0], "lux": [0, 0], "pres": [0, 0]}
MEDIA            =  {"temp": 0, "hum": 0, "lux": 0, "pres": 0}
DB               =  "/etc/pitemp/pitemp.db"


logging.basicConfig(level=logging.DEBUG)

# for triggering the shutdown procedure when a signal is detected
keyboard_trigger = Event()


def signal_handler(signal, frame):
    logging.info('Signal detected. Stopping threads.')
    keyboard_trigger.set()


DIRECTORY_PATH = 'static'
HOST = "0.0.0.0"
WEB_PORT = 80
app = Flask(__name__, static_url_path='')


class WebServerThread(Thread):
    '''
    Class to make the launch of the flask server non-blocking.
    Also adds shutdown functionality to it.
    '''

    def __init__(self, app, host, port):
        Thread.__init__(self)
        self.srv = make_server(host, port, app)
        self.ctx = app.app_context()
        self.ctx.push()

    def run(self):
        logging.info('Starting PiTemp server')
        self.srv.serve_forever()

    def shutdown(self):
        logging.info('Stopping PiTemp server')
        self.srv.shutdown()

def get_data(query):
    global GRAPH_VALUES, MIN_MAX, MEDIA, CURRENT_READING
    GRAPH_VALUES = {"temp": [], "hum": [], "lux": [], "pres": [], "time": []}
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    for row in c.execute(query):
        GRAPH_VALUES['time'].append(row[1])
        GRAPH_VALUES['temp'].append(row[2])
        GRAPH_VALUES['hum'].append(row[3])
        GRAPH_VALUES['lux'].append(row[4])
        GRAPH_VALUES['pres'].append(row[5])
        CURRENT_READING['trend'] = row[6]
    
    try:
        MEDIA['temp'] = "{:.1f}".format(sum(GRAPH_VALUES['temp']) / float(len(GRAPH_VALUES['temp'])))
        MEDIA['hum'] = "{:.1f}".format(sum(GRAPH_VALUES['hum']) / float(len(GRAPH_VALUES['hum'])))
        MEDIA['lux'] = "{:.1f}".format(sum(GRAPH_VALUES['lux']) / float(len(GRAPH_VALUES['lux'])))
        MEDIA['pres'] = "{:.1f}".format(sum(GRAPH_VALUES['pres']) / float(len(GRAPH_VALUES['pres'])))

        CURRENT_READING['temp'] = GRAPH_VALUES['temp'][-1]
        CURRENT_READING['hum'] = GRAPH_VALUES['hum'][-1]
        CURRENT_READING['lux'] = GRAPH_VALUES['lux'][-1]
        CURRENT_READING['pres'] = GRAPH_VALUES['pres'][-1]

        MIN_MAX['temp'] = [min(GRAPH_VALUES['temp']),
                           max(GRAPH_VALUES['temp'])]
        MIN_MAX['hum'] = [min(GRAPH_VALUES['hum']),
                          max(GRAPH_VALUES['hum'])]
        MIN_MAX['lux'] = [min(GRAPH_VALUES['lux']),
                          max(GRAPH_VALUES['lux'])]
        MIN_MAX['pres'] = [min(GRAPH_VALUES['pres']),
                           max(GRAPH_VALUES['pres'])]
    except ZeroDivisionError:
        MEDIA = {"temp": 0, "hum": 0, "lux": 0, "pres": 0}
        MIN_MAX = {"temp": [0, 0], "hum": [0, 0], "lux": [0, 0], "pres": [0, 0]}



@app.route("/")
def index():
    get_data('SELECT * FROM (SELECT * FROM pitemp ORDER BY ID DESC LIMIT 1440) ORDER BY ID ASC;') # Get last 97 row (24 bours)
    return render_template("index.html", current_reading=CURRENT_READING, graph_values=GRAPH_VALUES, min_max=MIN_MAX, media=MEDIA)


@app.route("/day_view", methods=['GET', 'POST'])
def day_view():
    if request.method == 'POST':
        day = request.get_data()
        day = [x.decode() for x in day.split()[1:4]]
        day = ' '.join(day)

        date = datetime.datetime.strptime(day, '%b %d %Y')
        query = "SELECT * from pitemp WHERE (time LIKE '{}%')".format(datetime.datetime.strftime(date, "%d-%m-%y"))
        get_data(query)

        return jsonify({"day": day, "media": MEDIA, "chart": GRAPH_VALUES, "min_max": MIN_MAX}), 200
    else:
        date = datetime.datetime.now() - datetime.timedelta(days=1)
        query = "SELECT * from pitemp WHERE (time LIKE '{}%')".format(datetime.datetime.strftime(date, "%d-%m-%y"))
        date = datetime.datetime.strftime(date, "%b %d %Y")
        get_data(query)
        return render_template("day.html", day=date, graph_values=GRAPH_VALUES, min_max=MIN_MAX, media=MEDIA)


@app.route("/custom_view", methods=['GET', 'POST'])
def custom_view():
    if request.method == 'POST':
        days = request.get_data()
        days = days.decode()
        days = days.split(" - ")
        days[0] = datetime.datetime.strptime(days[0], '%b %d %Y')
        days[1] = datetime.datetime.strptime(days[1], '%b %d %Y')
        
        query = "SELECT * from pitemp WHERE (time LIKE '{}%'".format(datetime.datetime.strftime(days[1], "%d-%m-%Y"))
        for i in range(1, (days[1]-days[0]).days + 1):
            day = days[1] - datetime.timedelta(days=i)
            query += " OR time LIKE '{}%'".format(datetime.datetime.strftime(day, "%d-%m-%Y"))
        query += ")"

        get_data(query)

        return jsonify({"day": day, "media": MEDIA, "chart": GRAPH_VALUES, "min_max": MIN_MAX}), 200
    else:
        end = datetime.datetime.now()
        start = end - datetime.timedelta(days=6)
        query = "SELECT * from pitemp WHERE (time LIKE '{}%'".format(datetime.datetime.strftime(end, "%d-%m-%Y"))
        
        for i in range(1,(end-start).days + 1):
            day = end - datetime.timedelta(days=i)
            query += " OR time LIKE '{}%'".format(datetime.datetime.strftime(day, "%d-%m-%Y"))
        query += ")"
        get_data(query)

        date = [datetime.datetime.strftime(start, "%b %d %Y"), datetime.datetime.strftime(end, "%b %d %Y")]
        return render_template("custom_range.html", days=date, graph_values=GRAPH_VALUES, min_max=MIN_MAX, media=MEDIA)

@app.route("/update", methods=["POST"])
def curr_update():
    global CURRENT_READING
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    query = "SELECT * FROM pitemp ORDER BY ID DESC LIMIT 1"
    for row in c.execute(query):
        CURRENT_READING['time'] = row[1]
        CURRENT_READING['temp'] = row[2]
        CURRENT_READING['hum'] = row[3]
        CURRENT_READING['lux'] = row[4]
        CURRENT_READING['pres'] = row[5]
    return jsonify(CURRENT_READING), 200


@app.route("/static/<path:path>")
def send_static(path):
    return send_from_directory(DIRECTORY_PATH, path)


if __name__ == "__main__":
    # registering both types of signals
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    # starting the web server
    webserver = WebServerThread(app, HOST, WEB_PORT)
    webserver.start()
    logging.info("Started PiTemp web server")

    # and run it indefinitely
    while not keyboard_trigger.is_set():
        sleep(0.5)

    # until some keyboard event is detected
    logging.info("Keyboard event detected")

    # trigger shutdown procedure
    webserver.shutdown()

    # and finalize shutting them down
    webserver.join()
    logging.info("Stopped all threads")

    sys.exit(0)
