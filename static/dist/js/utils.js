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

function ChartOptions(unit){
    var chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        legend: {
            display: false,
        },
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: unit,
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
    return chartOptions;
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

function set_table(ids, data) {
    $(ids.media).html(data.media);
    $(ids.min).html(data.min);
    $(ids.max).html(data.max);
};

function parse_time(time) {
    for (var i = 0; i < time.length; i++) {
        time[i] = moment(time[i], "YYYY-MM-DD HH:mm");
    }
    return time;
};

function calculate_table(arr){
    var sum = 0;
    for(var i in arr) {
        sum += arr[i];
    }

    return {'media': sum / arr.length, 'min': Math.min.apply(null, arr), 'max': Math.max.apply(null, arr)}
}


function update_chart(charts, api, chartOptions, destroy=false) {
    if (destroy){
        charts.temp.destroy();
        charts.hum.destroy();
        charts.lux.destroy();
    }
    // TODO: Remove loading class
    $.get(`/api/${api}/temperature`, function(data){
        var id ={'media': '#media_temp', 'min': '#min_temp', 'max': '#max_temp'};
        var values = calculate_table(data.temp);

        data.time = parse_time(data.time);
        charts.temp = create_chart('#tempChart', data.time, data.temp, chartOptions, "Temperatura", "rgba(23,162,184,0.5)", "rgba(23,162,184,1)");
        set_table(id, values);
        $('#overlay_temp_chart').removeClass('overlay dark');
        $('#spin_temp_chart').removeClass('fas fa-3x fa-sync-alt fa-spin');
    }, 'json');

    $.get(`/api/${api}/humidity`, function(data){
        var id ={'media': '#umid_temp', 'min': '#min_umid', 'max': '#max_umid'};
        var values = calculate_table(data.humidity);

        data.time = parse_time(data.time);
        charts.hum = create_chart('#umidChart', data.time, data.humidity, chartOptions, "Umidità", "rgba(40,167,69,0.5)", "rgba(40,167,69,1)");
        set_table(id, values);
        $('#overlay_hum_chart').removeClass('overlay dark');
        $('#spin_hum_chart').removeClass('fas fa-3x fa-sync-alt fa-spin');
    }, 'json');

    $.get(`/api/${api}/light`, function(data){
        var id ={'media': '#media_lux', 'min': '#min_lux', 'max': '#max_lux'};
        var values = calculate_table(data.light);

        data.time = parse_time(data.time);
        charts.lux = create_chart("#luxChart", data.time, data.light, chartOptions, "Luce", "rgba(255,193,7,0.5)", "rgba(255,193,7,1)");
        set_table(id, values);
        $('#overlay_lux_chart').removeClass('overlay dark');
        $('#spin_lux_chart').removeClass('fas fa-3x fa-sync-alt fa-spin');
    }, 'json');
};

function set_currentValue(data){
    $('#curr_temp').html(data.temp);
    $('#overlay_temp').removeClass('overlay dark');
    $('#spin_temp').removeClass('fas fa-3x fa-sync-alt fa-spin');

    $('#curr_hum').html(data.humidity);
    $('#overlay_hum').removeClass('overlay dark');
    $('#spin_hum').removeClass('fas fa-3x fa-sync-alt fa-spin');

    $('#curr_lux').html(data.light);
    $('#overlay_lux').removeClass('overlay dark');
    $('#spin_lux').removeClass('fas fa-3x fa-sync-alt fa-spin');

    $('#curr_pres').html(data.pressure);
    $('#overlay_pres').removeClass('overlay dark');
    $('#spin_pres').removeClass('fas fa-3x fa-sync-alt fa-spin');
};