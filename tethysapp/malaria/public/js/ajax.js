function updateDistricts() {
    $.ajax({
        url:'/apps/malaria/ajax/updatedistricts/',
        data: '',
        dataType: 'json',
        contentType: "application/json",
        method: 'POST',
        success: function(results) {
            console.log(results);
            }
        })
}


function getSpatialAverage(draw_layer) {
    data = {
        'polygondata': {
            'type': draw_layer.layerType,
            'coordinates': draw_layer.layer.toGeoJSON().geometry.coordinates[0],
        },
        'variable': $("#variables").val(),

    };
    console.log(JSON.stringify(data));
    $.ajax({
        url:'/apps/malaria/ajax/getSpatialAverage/',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: "application/json",
        method: 'POST',
        success: function(results) {
            console.log(results);
            alert("the average value is " + results['average']);
            }
        })
}