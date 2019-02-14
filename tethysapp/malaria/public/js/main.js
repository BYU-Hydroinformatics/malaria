$(document).ready(function() {
    ////////////////////////////////////////////////////////////////////////  FUNCTIONS
    function map() {
        // create the map
        return L.map('map', {
            zoom: 5,
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
        let wmsurl = 'http://127.0.0.1:7000/thredds/wms/testAll/malaria/coords/LIS_HIST_' + $("#dates").val() + '.nc';
        return wmsLayer = L.tileLayer.wms(wmsurl, {
            layers: $("#variables").val(),
            // useCache: true,
            crossOrigin: true,
            format: 'image/png',
            transparent: true,
            opacity: $("#opacity").val(),
            BGCOLOR: '0x000000',
            // styles: 'boxfill/' + color,
            // colorscalerange: min_bnd + ',' + max_bnd,
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

    ////////////////////////////////////////////////////////////////////////  INITIALIZE ON DOCUMENT READY

    //  Load initial map data as soon as the page is ready
    var mapObj = map();
    var basemapObj = basemaps();
    var layerObj = newLayer();
    var controlsObj = makeControls();

    ////////////////////////////////////////////////////////////////////////  EVENT LISTENERS

    //  Listener for the variable picker menu (selectinput gizmo)
    $("#dates").change(function () {
        clearMap();
        layerObj = newLayer();
        controlsObj = makeControls();
    });

    $("#variables").change(function () {
        clearMap();
        layerObj = newLayer();
        controlsObj = makeControls();
    });

    $("#opacity").change(function () {
        layerObj.setOpacity($('#opacity').val());
        });


});
