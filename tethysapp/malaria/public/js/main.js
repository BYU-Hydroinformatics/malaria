// Getting the csrf token
let csrftoken = Cookies.get('csrftoken');
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});



$(document).ready(function() {
    ////////////////////////////////////////////////////////////////////////  FUNCTIONS
    function map() {
        // create the map
        return L.map('map', {
            zoom: 5.25,
            minZoom: 1.25,
            boxZoom: true,
            maxBounds: L.latLngBounds(L.latLng(-100.0, -270.0), L.latLng(100.0, 270.0)),
            center: [-9, -75.5],
        });
    }

    function basemaps() {
        // create the basemap layers
        let Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
        let Esri_Imagery_Labels = L.esri.basemapLayer('ImageryLabels');
        return {"Basemap": L.layerGroup([Esri_WorldImagery, Esri_Imagery_Labels]).addTo(mapObj)}
    }

    function newLayer() {
        let wmsurl = wmsbase + $("#dates").val() + '.nc';
        return wmsLayer = L.tileLayer.wms(wmsurl, {
            layers: $("#variables").val(),
            // useCache: true,
            crossOrigin: true,
            format: 'image/png',
            transparent: true,
            opacity: $("#opacity").val(),
            BGCOLOR: '0x000000',
            styles: 'boxfill/' + $('#colors').val(),
            colorscalerange: bounds[$("#variables").val()],
        }).addTo(mapObj);
    }

    function makeControls() {
        return L.control.layers(basemapObj, {'GLDAS Layer': layerObj}).addTo(mapObj);
    }

    function clearMap() {
        controlsObj.removeLayer(layerObj);
        mapObj.removeLayer(layerObj);
        mapObj.removeControl(controlsObj);
    }

    function newLegend() {
        url = wmsbase + $("#dates").val() + '.nc' + "?REQUEST=GetLegendGraphic&LAYER=" + $("#variables").val() + "&PALETTE=" + $('#colors').val() + "&COLORSCALERANGE=" + bounds[$("#variables").val()];
        html = '<img src="' + url + '" alt="legend" style="width:50%; height:325px;">';
        $("#legend").html(html);
    }

    function getThreddswms(){
        $.ajax({
            url:'/apps/malaria/ajax/customsettings/',
            async: false,
            data: '',
            dataType: 'json',
            contentType: "application/json",
            method: 'POST',
            success: function(result) {
                console.log(result);
                wmsbase = result['threddsurl'] + 'LIS_HIST_';
                return wmsbase;
                },
            });
        return wmsbase;
        // return 'http://127.0.0.1:7000/thredds/wms/testAll/malaria/LIS_HIST_'
    }

    ////////////////////////////////////////////////////////////////////////  INITIALIZE ON DOCUMENT READY

    //  Load initial map data as soon as the page is ready
    var wmsbase = getThreddswms();
    var mapObj = map();
    var basemapObj = basemaps();
    var layerObj = newLayer();
    var controlsObj = makeControls();
    newLegend();

    ////////////////////////////////////////////////////////////////////////  EVENT LISTENERS

    //  Listener for the variable picker menu (selectinput gizmo)
    $("#dates").change(function () {
        clearMap();
        layerObj = newLayer();
        controlsObj = makeControls();
        newLegend();
    });

    $("#variables").change(function () {
        clearMap();
        layerObj = newLayer();
        controlsObj = makeControls();
        newLegend();
    });

    $("#opacity").change(function () {
        layerObj.setOpacity($('#opacity').val());
    });

    $('#colors').change(function () {
        clearMap();
        layerObj = newLayer();
        controlsObj = makeControls();
        newLegend();
    });


});
