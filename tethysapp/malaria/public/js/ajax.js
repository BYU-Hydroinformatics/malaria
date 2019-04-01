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