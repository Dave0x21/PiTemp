function temp_chart(label, data, ChartOptions) {
    var tempChartCanvas = $("#tempChart").get(0).getContext("2d");

    var tempChartData = {
        labels: label,
        datasets: [
            {
                label: "Temperatura",
                backgroundColor: "rgba(23,162,184,0.5)",
                borderColor: "rgba(23,162,184,1)",
                pointRadius: false,
                pointColor: "#3b8bba",
                pointStrokeColor: "rgba(23,162,184,1)",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(23,162,184,1)",
                data: data,
            },
        ],
    };

    var tempChart = new Chart(tempChartCanvas, {
        type: "line",
        data: tempChartData,
        options: ChartOptions,
    });
    return tempChart;
};

function hum_chart(label, data, ChartOptions) {
    var umidChartCanvas = $("#umidChart").get(0).getContext("2d");

    var umidChartData = {
        labels: label,
        datasets: [
            {
                label: "Umidità",
                backgroundColor: "rgba(40,167,69,0.5)",
                borderColor: "rgba(40,167,69,1)",
                pointRadius: false,
                pointColor: "rgba(40,167,69,1)",
                pointStrokeColor: "#c1c7d1",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(40,167,69,1)",
                data: data,
            },
        ],
    };

    var umidChart = new Chart(umidChartCanvas, {
        type: "line",
        data: umidChartData,
        options: ChartOptions,
    });
    return umidChart;
};

function lux_chart(label, data, ChartOptions) {
    var luxChartCanvas = $("#luxChart").get(0).getContext("2d");

    var luxChartData = {
        labels: label,
        datasets: [
            {
                label: "Luce",
                backgroundColor: "rgba(255,193,7,0.5)",
                borderColor: "rgba(255,193,7,1)",
                pointRadius: false,
                pointColor: "#3b8bba",
                pointStrokeColor: "rgba(255,193,7,1)",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(255,193,7,1)",
                data: data,
            },
        ],
    };

    var luxChart = new Chart(luxChartCanvas, {
        type: "line",
        data: luxChartData,
        options: ChartOptions,
    });
    return luxChart
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

    $('#min_temp').html(esponse.min_max.temp[0]);
    $('#max_temp').html(response.min_max.temp[1]);
    $('#min_hum').html(response.min_max.hum[0]);
    $('#max_hum').html(response.min_max.hum[1]);
    $('#min_lux').html(response.min_max.lux[0]);
    $('#max_lux').html(response.min_max.lux[1]);
    $('#min_pres').html(response.min_max.pres[0]);
    $('#max_pres').html(response.min_max.pres[1]);
};