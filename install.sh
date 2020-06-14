#!/bin/bash

echo("Installing PiTemp...")

sudo mkdir -pv /etc/pitemp
sudo mkdir -pv /var/www/pitemp

sudo cp  -r static templates /var/www/pitemp
sudo cp  -r icons /etc/pitemp
sudo cp pitemp /usr/local/bin
sudo cp pitemp_server /var/www/pitemp

sudo cp service/* /etc/systemd/system
sudo systemctl enable --now pitemp
sudo systemctl enable --now pitemp_server