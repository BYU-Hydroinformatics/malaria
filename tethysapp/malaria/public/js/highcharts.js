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
        noData: "No Data"
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
