var mymap;
var routes_layer = L.layerGroup();
var buses_layer = L.layerGroup();
var base_url = "http://data.foli.fi/gtfs/";

var bus_icon = L.icon({
    iconUrl: 'Images/yellow-bus.png',
    iconSize: [32, 32]
});

function list_lines() {
    let url = base_url + 'routes';
    $.ajax({
        url: url,
        method: 'get',
        success: function (routes) {
            console.log(routes);
            let list_of_routes = "";
            for (let i = 0; i < routes.length; i++) {
                let line = routes[i];
                list_of_routes += "<option value='" + line["route_id"] + "' name='" + line['route_short_name'] + "'>"
                    + line["route_id"] + " - " + line["route_long_name"] + "</option>";
            }
            $('#line').html(list_of_routes);
        }

    })
}

function show_buses() {
    let route_name = $('#line').find('option:selected').attr('name');
    console.log(route_name);
    let url_b = 'http://data.foli.fi/siri/vm/';
    $.ajax({
        url: url_b,
        method: 'get',
        success: function (vehicles) {
            let buses = Object.values(vehicles["result"]["vehicles"]);
            let buses_coordinates = [];
            buses_layer.clearLayers();
            routes_layer.clearLayers();
            for (let i = 0; i < buses.length; i++) {
                let bus = buses[i];
                if (bus["publishedlinename"] === route_name) {
                    L.marker([bus["latitude"], bus["longitude"]], {icon: bus_icon}).addTo(buses_layer);
                    buses_coordinates.push([bus["latitude"], bus["longitude"]]);
                }
            }

            if (buses_coordinates.length > 0) {
                buses_layer.addTo(mymap);
                //leaflet documentation
                //https://leafletjs.com/reference-1.3.4.html#latlngbounds
                let bounds = L.latLngBounds(buses_coordinates);
                mymap.fitBounds(bounds);
            } else {
                alert("There is no bus for this line");
            }
        }
        ,
        error: function () {
            alert("No buses available for this route");
        }
    });
}


function show_route() {
    let url = base_url + "trips/route/" + $('#line').val();

    $.ajax({
        url: url,
        method: 'get',
        success: function (trip) {
            draw_route(trip[0]['shape_id']);
        },
        error: function () {
            alert("No route available for this line");
        }
    });
}

function draw_route(shape_id) {
    let url = base_url + "shapes/" + shape_id;

    $.ajax({
        url: url,
        method: 'get',
        success: function (route) {
            buses_layer.clearLayers();
            routes_layer.clearLayers();

            let polyline = L.polyline(route, {color: '#FFFF00'});
            routes_layer
                .addLayer(polyline)
                .addTo(mymap);

            mymap.fitBounds(polyline.getBounds());
        },
        error: function () {
            alert("No route available for this line");
        }
    });
}

window.onload = function () {
    mymap = L.map('mapid').setView([51.505, -0.09], 13);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidGhvbXM5NzEiLCJhIjoiY2pvdHN1aDRvMDFhMzN1b2QzcWhrM2tzcCJ9.qwuklkoNtWzVO3aqKZzazw\n', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'your.mapbox.access.token'
    }).addTo(mymap);

    list_lines();
    $('#show_buses').on('click', show_buses);
    $('#refresh').on('click', show_buses);
    $('#show_routes').on('click', show_route);
};