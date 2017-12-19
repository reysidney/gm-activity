<!DOCTYPE html>
<html>
  <head>
    <title>Restaurants in CEBU</title>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
	<link type="text/css" rel="stylesheet" href="assets/css/style.css" />
	</head>
	<body>
		<input type="hidden" id="baseurl" value="<?php echo "http://" . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI']; ?>"/>
		<div id="floating-panel">
			<strong>Restaurants in CEBU</strong>
			<hr>
			<div class="content">
				<div class="travel-mode-div">
					<label>
						<input type="radio" name="travel_mode" value="WALKING" checked>
						<svg class="icon-walking">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="assets/images/travel_mode.svg#icon-walking"></use>
						</svg>
						<p>walking</p>
					</label>
					<label>
						<input type="radio" name="travel_mode" value="DRIVING">
						<svg class="icon-driving">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="assets/images/travel_mode.svg#icon-driving"></use>
						</svg>
						<p>&nbsp;driving</p>
					</label>
					<label>
						<input type="radio" name="travel_mode" value="TRANSIT">
						<svg class="icon-transit">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="assets/images/travel_mode.svg#icon-transit"></use>
						</svg>
						<p> &nbsp;transit</p>
					</label>
				</div>
				<div class="searchby">
					<label>Show 
					<select id="subtype_select"> 
					</select>
					<span id="type">Restaurants</span>
					<hr>
					<label for="count">There are <span id="count"> restaurants</span> within <input type="number" id="radius" value="1000" step="10"/> meters</label>
				</div>
			</div>
    </div>
    <div id="right-panel"></div>
    <div id="map"></div>
	</body>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<script src="assets/js/main.js"></script>
	<script src="https://maps.googleapis.com/maps/api/js?libraries=places,geometry,drawing&key=YOUR_API_KEY" async defer></script>
</html>
