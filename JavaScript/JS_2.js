var mymap;

function search(){
    let zip_code = $('#zip_code').val();
    let country = $('#country').val();
    if (!zip_code) {
        alert("Enter a ZIP CODE");
    }else{
        let url = "http://api.zippopotam.us/"+ country + '/'+ zip_code;

        $.ajax({
            url: url,
            method: 'get',
            success: function(map_points){
                //TODO : clear markers
                for(let i=0 ; i<map_points.places.length; i++){
                    let point = map_points.places[i];
                    let marker = L.marker([point["latitude"],point["longitude"]]).addTo(mymap);
                    marker.bindPopup("<b>"+ point["place name"]+"</b><br/>").openPopup();
                    markers.push(marker);
                }

            },
        })
    }



}

window.onload = function() {
    mymap = L.map('mapid').setView([51.505, -0.09], 13);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidGhvbXM5NzEiLCJhIjoiY2pvdHN1aDRvMDFhMzN1b2QzcWhrM2tzcCJ9.qwuklkoNtWzVO3aqKZzazw\n', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'your.mapbox.access.token'
    }).addTo(mymap);

    $('#search').on('click',search);
}