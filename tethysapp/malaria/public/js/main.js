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
    ////////////////////////////////////////////////////////////////////////  INITAL DOCUMENT SETUP
    placeholder();
    
    ////////////////////////////////////////////////////////////////////////  FUNCTIONS
    function map() {
        // create the map
        return L.map('map', {
            zoom: 6,
            minZoom: 5,
            maxZoom: 8,
            boxZoom: true,
            maxBounds: L.latLngBounds(L.latLng(-15.0, -85.0), L.latLng(0.0, -65.0)),
            center: [-8.5, -75.5],
        });
    }

    function basemaps() {
        // create the basemap layers
        let Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
        let Esri_Imagery_Labels = L.esri.basemapLayer('ImageryLabels');
        return {"Basemap": L.layerGroup([Esri_WorldImagery, Esri_Imagery_Labels]).addTo(mapObj)}
    }

    function newLdasLayer() {
        let wmsurl = wmsbase + $("#dates").val() + '.nc';
        return wmsLayer = L.tileLayer.wms(wmsurl, {
            layers: $("#variables").val(),
            // useCache: true,
            // crossOrigin: true,
            format: 'image/png',
            transparent: true,
            opacity: $("#opacity").val(),
            BGCOLOR: '0x000000',
            styles: 'boxfill/' + $('#colors').val(),
            colorscalerange: bounds[$("#variables").val()],
        }).addTo(mapObj);
    }

    function newDistrictsLayer() {
        return boundarylayer = L.tileLayer.wms('https://tethys.byu.edu/geoserver/malariatracker/wms', {
            layers: 'malariatracker:distritoloreto',
            format: 'image/png',
            transparent: true,
        }).addTo(mapObj);
    }

    function makeControls() {
        return L.control.layers(basemapObj, {'LDAS Layer': LdasLayerObj, 'District Boundaries': DistrictLayerObj}).addTo(mapObj);
    }

    function clearMap() {
        controlsObj.removeLayer(LdasLayerObj);
        controlsObj.removeLayer(DistrictLayerObj);
        mapObj.removeLayer(LdasLayerObj);
        mapObj.removeLayer(DistrictLayerObj);
        mapObj.removeControl(controlsObj);
    }

    function getThreddswms() {
        $.ajax({
            url:'/apps/malaria/ajax/customsettings/',
            async: false,
            data: '',
            dataType: 'json',
            contentType: "application/json",
            method: 'POST',
            success: function(result) {
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
    var LdasLayerObj = newLdasLayer();
    var DistrictLayerObj = newDistrictsLayer();
    mapObj.removeLayer(LdasLayerObj);
    var controlsObj = makeControls();

    const legend = L.control({position:'bottomleft'});
    legend.onAdd = function() {
        let div = L.DomUtil.create('div', 'legend');
        let url = wmsbase + $("#dates").val() + '.nc' + "?REQUEST=GetLegendGraphic&LAYER=" + $("#variables").val() + "&PALETTE=" + $('#colors').val() + "&COLORSCALERANGE=" + bounds[$("#variables").val()];
        div.innerHTML = '<img src="' + url + '" alt="legend" style="width:100%; float:right;">';
        return div
    };

    var drawnItems = new L.FeatureGroup().addTo(mapObj);      // FeatureGroup is to store editable layers
    var drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems,
            edit: false,
        },
        draw: {
            polyline: false,
            circlemarker:false,
            circle:false,
            polygon:false,
            rectangle:false,
            point:false,
        },
    });
    mapObj.addControl(drawControl);
    mapObj.on("draw:drawstart ", function () {     // control what happens when the user draws things on the map
        drawnItems.clearLayers();
    });

    mapObj.on(L.Draw.Event.CREATED, function (event) {
        drawnItems.addLayer(event.layer);
        L.Draw.Event.STOP;
        getSpatialAverage(event);
    });


    ////////////////////////////////////////////////////////////////////////  EVENT LISTENERS
    $('#historicaltoggle').click(function() {
        $('#historical_controls_wrapper').toggle();
        if ($('#historicaltoggle').is(":checked")) {
            LdasLayerObj.addTo(mapObj);
            legend.addTo(mapObj);
        } else {
            mapObj.removeLayer(LdasLayerObj);
        }
    });

    //  Listener for the variable picker menu (selectinput gizmo)
    $("#dates").change(function () {
        clearMap();
        LdasLayerObj = newLdasLayer();
        DistrictLayerObj = newDistrictsLayer();
        controlsObj = makeControls();
        legend.addTo(mapObj);
    });

    $("#variables").change(function () {
        clearMap();
        LdasLayerObj = newLdasLayer();
        DistrictLayerObj = newDistrictsLayer();
        controlsObj = makeControls();
        legend.addTo(mapObj);
    });

    $("#rasteropacity").change(function () {
        LdasLayerObj.setOpacity($('#rasteropacity').val());
    });

    $("#boundaryopacity").change(function () {
        DistrictLayerObj.setOpacity($('#boundaryopacity').val());
    });

    $('#colors').change(function () {
        clearMap();
        LdasLayerObj = newLdasLayer();
        DistrictLayerObj = newDistrictsLayer();
        controlsObj = makeControls();
        legend.addTo(mapObj);
    });


});
