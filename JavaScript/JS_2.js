var mymap;
var markers= L.layerGroup();

function search(){
    let zip_code = $('#zip_code').val();
    let country = $('#country').val();
    if (!zip_code) {
        alert("Enter a ZIP CODE");
    }else{
        let url = "https://api.zippopotam.us/"+ country + '/'+ zip_code;

        $.ajax({
            url: url,
            method: 'get',
            success: function(map_points){
                let places_found = [];
                //Stackoverflow link
                //https://stackoverflow.com/questions/41256026/clear-marker-layers-leaflet
                markers.clearLayers();
                let table_content = '';
                for(let i=0 ; i<map_points.places.length; i++){
                    let point = map_points.places[i];
                    let marker = L.marker([point["latitude"],point["longitude"]]).addTo(markers);
                    marker.bindPopup("<b>"+ point["place name"]+"</b><br/>");

                    places_found.push([point["latitude"],point["longitude"]]);

                    table_content += "<tr>" +
                        "<td>" + point["place name"] + "</td>" +
                        "<td>"+ point["latitude"] + "</td>" +
                        "<td>" + point["longitude"] + "</td>" +
                        "</tr>";
                }
                $('#table_content').html(table_content);

                markers.addTo(mymap);
                //leaflet documentation
                //https://leafletjs.com/reference-1.3.4.html#latlngbounds
                let bounds = L.latLngBounds(places_found);
                mymap.fitBounds(bounds);
            },
            error: function () {
                alert("Didn't find place corresponding to " + country + "/" + zip_code);
            }
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