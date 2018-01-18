<!DOCTYPE html>
<html>
  	<head>
		<title>Restaurants</title>
		<meta name="viewport" content="initial-scale=1.0, user-scalable=no">
		<meta charset="utf-8">
		<link type="text/css" rel="stylesheet" href="assets/css/style.css?v=2.02" />
	</head>
	<body>
		<input type="hidden" id="baseurl" value="<?php echo "http://" . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI']; ?>"/>
		<div class="bg_overlay_alt">
			<div class="loader">
				<img src="assets/images/loader.svg">
				<p>Getting all restaurants. Please wait...</p>
			</div>
		</div>
		<div class="show-menu hide">
			<span>&#9776; Restaurants</span>
		</div>
		<div id="floating-panel">
			<strong>Restaurants</strong>
			<span class="close-menu">&times;</span>
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
				<hr>
				<div class="searchby">
					<div class="width-50">
						<label>Types:
						</label>
						<span id="subtype_select"></span>
					</div>
					<div class="width-50">
						<label>Specialties:
						</label>
						<span id="subspecial_select"></span>
					</div>
				</div>
				<hr>
				<div class="radius_count">
					<label for="count">There <span id="count"></span> within <input type="number" id="radius" value="1000" step="10"/> meters</label>
				</div>
			</div>
		</div>
		<div id="right-panel"></div>
		<div id="map"></div>
		<div id="footer"> 
			<div id="footerbuttondown">Hide Pie Chart &#9660; </div>
			<div id="footerbuttonup">Show Pie Chart &#9650;</div>
			<div id="footercont">
				<div id="chartContainer"></div>
			</div>
		</div>
	</body>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
	<script src="https://canvasjs.com/assets/script/jquery.canvasjs.min.js"></script> 
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<script src="assets/js/main.js?v=2.02"></script>
	<script src="assets/js/footer.js?v=2.01"></script>
	<script src="https://maps.googleapis.com/maps/api/js?libraries=places,geometry,drawing&key=AIzaSyBAxVfzlvsIwDlwmGYxYCh4TL4VjcANG3c" async defer></script>
</html>
