var mymap;
var routes_layer = L.layerGroup();
var buses_layer = L.layerGroup();
var buses;
var base_url = "http://data.foli.fi/gtfs/";

function list_lines() {
    let url = base_url + 'routes';
    $.ajax({
        url: url,
        method: 'get',
        success: function (routes) {
            console.log(routes);
            let list_of_routes = "";
            for (let i = 0 ; i<routes.length ; i++){
                let line = routes[i];
                list_of_routes += "<option value='"+ line["route_id"] +"'>" +line["route_id"] +" - "+
                    line["route_long_name"] +"</option>";
            }
            $('#line').html(list_of_routes);
        }

    })
}

window.onload = function() {
    mymap = L.map('mapid').setView([51.505, -0.09], 13);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidGhvbXM5NzEiLCJhIjoiY2pvdHN1aDRvMDFhMzN1b2QzcWhrM2tzcCJ9.qwuklkoNtWzVO3aqKZzazw\n', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'your.mapbox.access.token'
    }).addTo(mymap);

    list_lines();
};