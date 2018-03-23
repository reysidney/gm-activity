var map;
var markerCluster;
var infowindow;
var myLatLng;
var directionsDisplay;
var directionsService;
var cityCircle;
var count;
var prevPoint;
var placeService;
var sampleData;
var selectedCoords;
var inspectMarker;
var markers_arr = [];
var $radius = $('#radius');
var $subType = $('#subtype_select');
var $subSpecial = $('#subspecial_select');

// get current location
function locate() {
    navigator.geolocation.getCurrentPosition(initialize,fail);
}

// call when failed to get Current Location
function fail() {
    alert('Failed to get your Location.');
    var defaultPosition = {
        coords: {
            latitude: 10.3193294,
            longitude: 123.903832
        }, 
    };
    initialize(defaultPosition);
}

// initialize all
function initialize(position) {
    $('#floating-panel').show();
    var radius = parseInt($radius.val());
    var type = 'restaurant';
    var map_style = $.getJSON( "assets/json/map_style.json");
    //var restaurantJSON = $.getJSON( "assets/json/restaurants.json");
    myLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    count = 0;
    directionsDisplay = new google.maps.DirectionsRenderer;
    directionsService = new google.maps.DirectionsService();
    infowindow = new google.maps.InfoWindow();

    $('.radius').text(radius);

    map_style.done(function(map_style) {
        // set map options  
        var mapOptions = {
            zoom: radiusToZoom(radius),
            center: myLatLng,
            styles: map_style
        }
        // initialize map
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        // add click listener for map for drawing circles
        map.addListener('click', function(event) {    
            cityCircle.setCenter(event.latLng); 
        });
        
        placeService = new google.maps.places.PlacesService(map);
        // set map for directions
        directionsDisplay.setMap(map);
        // set panel for directions
        directionsDisplay.setPanel(document.getElementById('right-panel'));
        // draw self marker
        drawSelfMarker(myLatLng);
        // display all restaurants
        populateTypeOption();
        getRestaurants();
        //displayRestaurantJSON(restaurantJSON);
    });
}

// add change event for when radius is changed
$radius.on('change', function () {
    cityCircle.setRadius(parseInt($(this).val()));
    map.setZoom(radiusToZoom(parseInt($radius.val())));
    map.setCenter(selectedCoords);
});

// add change event when restaurant type/specialty is changed
$('#subtype_select, #subspecial_select').on('change', 'input[name=subtype]', function () {
    if(this.checked)
        getRestaurantsByType(this.value);
    else 
        removeRestaurantsByType(this.value);
});

// add change event when travel mode is changed
$('input[name=travel_mode]').on('change', function () {
    if(prevPoint)
        calculateRoute(myLatLng, prevPoint);
});

//open nav menu
$('.show-menu').on('click', function () {
    $(this).addClass('hide');
    $('#floating-panel').removeClass('hide');
});

$('.close-menu').on('click', function () {
    $('.show-menu').removeClass('hide');
    $('#floating-panel').addClass('hide');
});

// display sample data restautants
function displayRestaurantJSON (restaurantJSON) {
    restaurantJSON.done(function(results) {
        if(results.length > 0) {
            sampleData = results;
            createPieChart();
            populateTypeOption();
            filterRestaurants();
        }
    });
}

//get restaurant types
function getRestoTypes () {
    var types = $('input[name="subtype"]:checked').map(function () {
        return this.value;
    }).get();
    return types;
}

//get restaurants
function getRestaurants () {
	removeMarkers();
    count = 0;
    sampleData = [];
    updateCountDisplay(count);

    var types = getRestoTypes();
    for(var i in types) {
        getRestaurantsByType(types[i]);
    }
}

//get restaurants by type
function getRestaurantsByType (type) {
    var request = {
        location: selectedCoords,
        radius: $radius.val(),
        query: type + " restaurant"
    };
    $('.bg_overlay_alt').addClass('is_show');
    $('body').addClass('no_scroll');
    placeService.textSearch(request, function (results, status, pagination) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            callbackTextSearch(results, pagination, type);
        }
    });
}

//remove restaurants by type
function removeRestaurantsByType (type) {
    for(var i in sampleData) {
        if(sampleData[i].type == type) {
            markers_arr[i].setMap(null);
            markers_arr[i] = null;
            sampleData[i] = null;
            count--;
            i--;
        }
    }
    sampleData = sampleData.filter(n => n);
    markers_arr = markers_arr.filter(n => n);
    createPieChart();
    updateCountDisplay(count);
}

//callback function for textSearch
function callbackTextSearch (results, pagination, type) {
    for(var i in results) {
        results[i].type = type;
        getCountInRadius(results[i]);
    }

    updateCountDisplay(count);
    createPieChart();
    
    $('.bg_overlay_alt').removeClass('is_show');
    $('body').removeClass('no_scroll');

    markerCluster = new MarkerClusterer(map, markers_arr,
        {imagePath: 'assets/images/cluster_img/m'}
    );

    // if(pagination.hasNextPage) {
    //     $('.bg_overlay_alt').addClass('is_show');
    //     $('body').addClass('no_scroll');
    //     pagination.nextPage();
    // } else {
    //     $('.bg_overlay_alt').removeClass('is_show');
    //     $('body').removeClass('no_scroll');
        
    //     updateCountDisplay(count);
    //     createPieChart();
    // }
}

// draw marker of current location
function drawSelfMarker () {
    //set marker
    var userMarker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        animation: google.maps.Animation.BOUNCE,
        title: "You are here!",
        icon: getIcon("assets/images/placeholder.svg")
    });

    // draw circle within current location
    drawCircle(myLatLng, parseInt($radius.val()));

    // add info window when self marker is clicked
    userMarker.addListener('click', function() {
        this.setAnimation(null);
        infowindow.setContent("You are here!");
        infowindow.open(map, this);
    });
}

//draws a circle when user clicks the map
function drawCircle(point, radius) {
    removeCircle();
    selectedCoords = point;
    // set Circle
    cityCircle = new google.maps.Circle({
        strokeOpacity: 0.8,
        strokeWeight: 2,
        strokeColor: '#3498db',
        fillOpacity: 0.35,
        fillColor: '#3498db',
        map: map,
        center: point,
        radius: radius,
        cursor: "hand",
        editable: true
    });

    //event listener for when circle's radius changes
    google.maps.event.addListener(cityCircle, 'radius_changed', function() {
        $radius.val(this.getRadius().toFixed(0));
        getRestaurants();
    });

    //event listener for when circle's center changes
    google.maps.event.addListener(cityCircle, 'center_changed', function() {
        selectedCoords = this.getCenter();
        inspectMarker.setPosition(selectedCoords);
        getRestaurants();
    });

    //create inspect marker
    inspectMarker = new google.maps.Marker({
        position: selectedCoords,
        map: map,
        title: "here",
        icon: getIcon("assets/images/placeholder_inspect.svg")
    });
}

// compute zoom value base on radius
function radiusToZoom(radius){
    radius *= 0.00035;
    return Math.round(14-Math.log(radius)/Math.LN2) - 1;
}

//set icons base on url
function getIcon(url) {
	var icon = {
        url: url, //url
        scaledSize: new google.maps.Size(50, 50), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(20,40), // anchors
        labelOrigin: new google.maps.Point(20,-10)
    }

    return icon;
}

// create marker and marker events
function createMarker(place) {
    // get place location
    var placeLoc = place.geometry.location;

    //get icon
    var icon = getIcon("assets/images/pin.svg");
    
    //set marker
    var marker = new google.maps.Marker({
        map: map,
        title: place.name,
        animation: null,
        position: placeLoc,
        icon: icon
    });

    // add click event for marker
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(setMarkerContent(place, this.getPosition()));
        infowindow.open(map, this);
        bounceMarker(this);
    });

    // add right click event for marker
    google.maps.event.addListener(marker, "rightclick", function() {
        infowindow.setContent(setMarkerContent(place, this.getPosition()));
        infowindow.open(map, this);
        bounceMarker(this);
    });
    
    sampleData.push(place);
    // save markers for easy clearing
    markers_arr.push(marker);
    count++;
}

// set marker info window
function setMarkerContent (place, position) {
    var images = "";
    var ratings = "";
    var prices = "";
    var pricesArr = ['Free', 'Inexpensive', 'Moderate', 'Expensive', 'Very Expensive'];
    if(place.photos !== undefined) {
        var url = place.photos[0].getUrl({'maxWidth': 1000, 'maxHeight': 1000});
        images = '<p>'+
            '<a href="'+url+'" target="_blank">' +
            '   <image src="'+url+'" style="width:200px;">'+
            '</a>' + 
        '</p>';
    }
    if(place.rating !== undefined) {
        ratings = '<p><b>Ratings: </b> ' +
            place.rating + 
        '</p>';
    }

    if(place.price_level !== undefined) {
        prices = '<p><b>Price Level: </b> ' +
            pricesArr[parseInt(place.price_level)] + 
        '</p>';
    }
    var result = '<div id="content">' +
            '<h3 id="name">' +
                '<b>'+place.name+'</b>' +
            '</h3>' +
            '<p><b>Address: </b> ' +
                place.formatted_address + 
            '</p>'+
            ratings + prices +
            "<a href='#' onclick='getDirections("+
                position.lat() +
                ", "+
                position.lng() +
            ")' id='directions'>Get Directions</a><hr>"+
            images +
        '</div>';
    return result;
}

// get directions to marker 
function getDirections (lat, lng) {
    prevPoint = {lat: lat, lng: lng};
    calculateRoute(myLatLng, prevPoint);
}

// calculate route
function calculateRoute(start, end) {
    directionsDisplay.setMap(map);
    directionsService.route({
        origin: start,
        destination: end,
        travelMode: $('input[name=travel_mode]:checked').val(),
    }, function(response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            alert('Directions request failed due to ' + status);
        }
    });
}

// filter restaurants
function filterRestaurants() {
    removeMarkers();
    count = 0;
    //get all checked value
    var types = getRestoTypes();

	// loop through all sample data
	for (var i in sampleData) {
        // get restaurants matching the selected type
		if(types.indexOf("" +sampleData[i].types) != -1) {
            getCountInRadius(sampleData[i]);
		}
    }
    updateCountDisplay(count);
}

// get count within radius 
function getCountInRadius (place) {
    if(selectedCoords) {
        var diff = (google.maps.geometry.spherical.computeDistanceBetween(place.geometry.location, selectedCoords));
        if(diff <= $radius.val()) {
            createMarker(place);
        }
    }
}

// update count display
function updateCountDisplay(count) {
    text_count = "is only " + count + " restaurant";
    if(count > 1)
        text_count = "are " + count + " restaurants";
    else if(count == 0) 
        text_count = "are no restaurants";
    $('#count').text(text_count);
    return text_count;
}

//clears current route if there is a route.
function clearRoutes() {
    if (directionsDisplay != null) {
        // empty html content for directions
        $('#right-panel').html('');
        // set previous point to null
        prevPoint = null;
        directionsDisplay.setMap(null);
    }
}

// remove circle, if there is a circle
function removeCircle() {
	if(cityCircle != undefined) {
        cityCircle.setMap(null);
        inspectMarker.setMap(null);
    }
}

// remove markers in the map
function removeMarkers() {
	if(markers_arr.length > 0) {
    	for(var i = 0; i < markers_arr.length; i++) {
		   markers_arr[i].setMap(null);
		}
    }
    markerCluster.clearMarkers();
    
}

// returns all unique values
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

// populates options for restaurant types
function populateTypeOption () {
    var options = '';
    var type = ['Fast Food', 'Casual Dining', 'Fine Dining'];//,'Ethnic', 'Fast Casual', 'Family Style'];
    var special = ['Barbeque', 'Lechon', 'Steak'];//, 'Dessert', 'Pizza', 'Vegetarian'];
    type.sort();
    special.sort();

    $.each( type.filter( onlyUnique ), function( key, value ) {
        options += '<br><input type="checkbox" name="subtype" id="'+ value + '" value="'+ value + '" checked/><label for="'+ value + '">'+ value + '</label>';
    });

    $subType.html(options);

    options = '';
    $.each( special.filter( onlyUnique ), function( key, value ) {
        options += '<br><input type="checkbox" name="subtype" id="'+ value + '" value="'+ value + '" checked/><label for="'+ value + '">'+ value + '</label>';
    });

    $subSpecial.html(options);
}

// unbounces other marker and toggle bounce clicked marker
var prevClickedMarker;
function bounceMarker(clicked) {
    if(prevClickedMarker)
        prevClickedMarker.setAnimation(null);

    if (clicked.getAnimation() !== null) {
          clicked.setAnimation(null);
    } else {
        clicked.setAnimation(google.maps.Animation.BOUNCE);
    }

    prevClickedMarker = clicked;
}

// process sample data to display pie chart
function processSampleData() {
    var array = [];
    var type = [];
    for(var i in sampleData) {
        if(sampleData[i].type) {
            array.push({
                y: 1 ,
                label: sampleData[i].type,
                legendText: sampleData[i].type
                //label : sampleData[i].opening_hours.open_now ? "Open" : "Close",
                //legendText: sampleData[i].opening_hours.open_now ? "Open" : "Close",
            });
        } //else {
        //     array.push({
        //         label : "No Schedule",
        //         y: 1 ,
        //         legendText: "No Schedule",
        //     });
        // }
    }
    var result = [];
    array.forEach(function(value) {
        var existing = result.filter(function(v, i) {
            return v.legendText == value.legendText;
        });
        if (existing.length) {
            var existingIndex = result.indexOf(existing[0]);
            result[existingIndex].y += value.y;
        } else {
            result.push(value);
        }
    });
    
    return result;
}

// create pie chart for types of restaurant
function createPieChart() {
    $("#chartContainer").CanvasJSChart({ 
		title: { 
			text: "Restaurants (within the circle)",
			fontSize: 24
		}, 
		legend :{ 
			verticalAlign: "center", 
            horizontalAlign: "right",
            title: "Restaurants"
		}, 
		data: [ 
            { 
                type: "pie", 
                showInLegend: true, 
                toolTipContent: "{label} Restaurants", 
                indexLabel: "{y} {label}", 
                dataPoints: processSampleData()
            } 
		] 
	}); 
}

$(document).ready(function () {
    locate();

    $("#floating-panel").draggable({
        cursor: 'move'
    });
});