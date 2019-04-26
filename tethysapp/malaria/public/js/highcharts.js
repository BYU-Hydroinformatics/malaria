// Global Highcharts options
Highcharts.setOptions({
    lang: {
        downloadCSV: "Download CSV",
        downloadJPEG: "Download JPEG image",
        downloadPDF: "Download PDF document",
        downloadPNG: "Download PNG image",
        downloadSVG: "Download SVG vector image",
        downloadXLS: "Download XLS",
        loading: "Loading Data",
        noData: "Please Select A District"
    },
});

function placeholder() {
    // Place holder chart
    chart = Highcharts.chart('highchart', {
        title: {
            align: "center",
            text: "Historical Risk"
        },
        xAxis: {
            type: 'datetime',
            title: {text: "Time"}
        },
        yAxis: {
            title: {text: 'Risk Level'}
        },
        series: [{
            data: []
        }],
        chart: {
            animation: true,
            zoomType: 'x',
            borderColor: '#000000',
            borderWidth: 2,
            type: 'area'
        },
        noData: {
            style: {
                fontWeight: 'bold',
                fontSize: '15px',
                color: '#303030'
            }
        }
    });
}

function historicRiskPlot(data) {
    chart = Highcharts.chart('highchart', {
        title: {
            align: "center",
            text: 'Historical Risk for District ' + data['ubigeo']
        },
        xAxis: {
            type: 'linear',
            title: {text: "2019 Epidemiological Week (Epiweek)"}
        },
        yAxis: {
            title: {text: 'Risk'},
            min: 0,
            max: 1
        },
        series: [
            {
                data: data['highrisk'],
                type: "area",
                name: "High Risk",
                color: 'red',
                },
            {
                data: data['mediumrisk'],
                type: "area",
                name: "Medium Risk",
                color: 'yellow',
                },
            {
                data: data['lowrisk'],
                type: "area",
                name: "Low Risk",
                color: 'green',
                },
            {
                data: data['historical'],
                type: "line",
                name: 'Historical Risk',
                color: 'black'
                }
        ],
        chart: {
            animation: true,
            zoomType: 'x',
            borderColor: '#000000',
            borderWidth: 2,
            type: 'area'
        }
    });
}