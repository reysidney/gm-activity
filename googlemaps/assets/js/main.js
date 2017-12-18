var map;
var infowindow;
var myLatLng;
var travelMode;
var directionsDisplay;
var directionsService;
var cityCircle;
var placeService;
var $radius = $('#radius');

function locate() {
    navigator.geolocation.getCurrentPosition(initialize,fail);
}

function fail() {
    alert('Failed to get your Location.');
    var defaultPosition = {
        coords: {
            latitude: 10.3193294,
            longitude: 123.903832
        }
    };
    initialize(defaultPosition);
}

function initialize(position) {
    $('#floating-panel').show();
    var radius = parseInt($radius.val());
    var type = 'restaurant';
    var json = $.getJSON( "assets/json/map_style.json");
    myLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    travelMode = "WALKING";
    directionsDisplay = new google.maps.DirectionsRenderer;
    directionsService = new google.maps.DirectionsService();
    infowindow = new google.maps.InfoWindow();

    json.done(function(map_style){  
        var mapOptions = {
            zoom: 18,
            center: myLatLng,
            styles: map_style
        }

        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('right-panel'));
        searchByRadiusType(radius, type);
        drawSelfMarker(myLatLng);
    });
}

$radius.on('change', function () {
    updateMap ();
});

function updateMap () {
    var radius = parseInt($radius.val());
    var type = 'restaurant';
    searchByRadiusType(radius, type);
}

function drawSelfMarker (myLatLng) {
    var userMarker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: "Current Location"
    });
}

function drawCircle(radius) {
    if(cityCircle)
        cityCircle.setMap(null);
    cityCircle = new google.maps.Circle({
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillOpacity: 0.35,
        fillColor: '#FFFFFF',
        map: map,
        center: myLatLng,
        radius: radius,
        cursor: "hand"
    });
}

function searchByRadiusType(radius, type) {
    if(placeService) {
        placeService = null;
    }
    placeService = new google.maps.places.PlacesService(map);
    placeService.nearbySearch({
        location: myLatLng,
        radius: radius,
        type: [type]
    }, callback);
    drawCircle(radius);
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var icon = {
        url: place.icon,
        scaledSize: new google.maps.Size(30, 30),
        labelOrigin: new google.maps.Point(15, 40)
    }
    var marker = new google.maps.Marker({
        map: map,
        title: place.name,
        position: placeLoc,
        icon: icon,
        label: place.name,
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(setMarkerContent(place, this.getPosition()));
        infowindow.open(map, this);
    });

    google.maps.event.addListener(marker, "rightclick", function() {
        infowindow.setContent(setMarkerContent(place, this.getPosition()));
        infowindow.open(map, this);
    });
}

function setMarkerContent (place, position) {
    var result = "";
    result += "<div>"+place.name+"<hr><a href='#' onclick='getDirections("+position.lat()+", "+ position.lng() +")' id='directions'>Get Directions</a></div>";
    return result;
}

function getDirections (lat, lng) {
    var point = {lat: lat, lng: lng};
    calculateRoute(myLatLng, point);
}

function calculateRoute(start, end) {
    directionsService.route({
        origin: start,
        destination: end,
        travelMode: travelMode
    }, function(response, status) {
        if (status === 'OK') {
        directionsDisplay.setDirections(response);
        } else {
        alert('Directions request failed due to ' + status);
        }
    });
}

$(document).ready(function () {
    locate();
});