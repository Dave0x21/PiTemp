function create_chart(id, label, data, ChartOptions, name, backColor, lineColor) {
    var ChartCanvas = $(id).get(0).getContext("2d");

    var ChartData = {
        labels: label,
        datasets: [
            {
                label: name,
                backgroundColor: backColor,
                borderColor: lineColor,
                pointRadius: false,
                pointColor: lineColor,
                pointStrokeColor: lineColor,
                pointHighlightFill: "#fff",
                pointHighlightStroke: lineColor,
                data: data,
            },
        ],
    };

    var myChart = new Chart(ChartCanvas, {
        type: "line",
        data: ChartData,
        options: ChartOptions,
    });
    return myChart;
};

var ChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
        display: false,
    },
    scales: {
        xAxes: [{
            type: 'time',
            time: {
                unit: 'hour',
                stepSize: 1,
                displayFormats: {
                    hour: "HH:mm"
                },
                tooltipFormat: "D MMM HH:mm",
            }
        }],
        yAxes: [
            {
                gridLines: {
                    display: true,
                },
                ticks: {
                    beginAtZero: false,
                }
            },
        ],
    },
};

function trend_icon(trend) {
    switch (trend) {
        case '>':
            return 'fa-caret-up';
        case '=':
            return 'fa-caret-right';
        case '<':
            return 'fa-caret-down';
    }
};

function pressure_icon(pressure) {
    if (pressure < 970) {
        return 'fa-bolt';
    }
    else if (pressure < 990) {
        return 'fa-cloud-rain';
    }
    else if (pressure < 1010) {
        return 'fa-cloud';
    }
    else {
        return 'fa-sun';
    }
};

function set_table(response) {
    $('#media_temp').html(response.media.temp);
    $('#media_hum').html(response.media.hum);
    $('#media_lux').html(response.media.lux);
    $('#media_pres').html(response.media.pres);

    $('#min_temp').html(response.min_max.temp[0]);
    $('#max_temp').html(response.min_max.temp[1]);
    $('#min_hum').html(response.min_max.hum[0]);
    $('#max_hum').html(response.min_max.hum[1]);
    $('#min_lux').html(response.min_max.lux[0]);
    $('#max_lux').html(response.min_max.lux[1]);
    $('#min_pres').html(response.min_max.pres[0]);
    $('#max_pres').html(response.min_max.pres[1]);
};

function parse_time(time) {
    for (var i = 0; i < time.length; i++) {
        time[i] = moment(time[i], "YYYY-MM-DD HH:mm");
    }
    return time;
};

function update_chart(charts, data, chartOptions, destroy=false) {
    if (destroy){
        charts.temp.destroy();
        charts.hum.destroy();
        charts.lux.destroy();
    }
    data.time = parse_time(data.time);
    charts.temp = create_chart('#tempChart', data.time, data.temp, chartOptions, "Temperatura", "rgba(23,162,184,0.5)", "rgba(23,162,184,1)");
    charts.hum = create_chart('#umidChart', data.time, data.hum, chartOptions, "Umidità", "rgba(40,167,69,0.5)", "rgba(40,167,69,1)");
    charts.lux = create_chart("#luxChart", data.time, data.lux, chartOptions, "Luce", "rgba(255,193,7,0.5)", "rgba(255,193,7,1)");
};
