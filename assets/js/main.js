var map;
var infowindow;
var myLatLng;
var travelMode;
var directionsDisplay;
var directionsService;
var cityCircle;
var count;
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
    count = 0;
    directionsDisplay = new google.maps.DirectionsRenderer;
    directionsService = new google.maps.DirectionsService();
    infowindow = new google.maps.InfoWindow();

    $('.radius').text(radius);
    json.done(function(map_style){  
        var mapOptions = {
            zoom: 19,
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
    navigator.geolocation.getCurrentPosition(initialize,fail);
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
    placeService = new google.maps.places.PlacesService(map);
    placeService.nearbySearch({
        location: myLatLng,
        radius: radius,
        type: [type]
    }, callback);
    drawCircle(radius);
}

function callback(results, status, pagination) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        createMarkers(results);
        count += results.length;
        if (pagination.hasNextPage) {
            pagination.nextPage();
        }
    }
    text_count = count + " restaurant";
    if(count > 1)
        text_count += "s";
    $('#count').text(text_count);
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
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

function createMarkers(places) {
    var place;
    for (var i = 0; place = places[i]; i++) {
        console.log(place);
        createMarker(place);
    }
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