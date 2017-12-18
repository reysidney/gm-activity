<!DOCTYPE html>
<html>
  <head>
    <title>Place searches</title>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
	<link type="text/css" rel="stylesheet" href="assets/css/style.css" />
	</head>
	<body>
		<div id="floating-panel">
			<strong>Map Filters</strong>
			<hr>
			<div class="content">
				<!-- <label>Find </label>
				<select id="type_select"> 
					<option value="restaurant"> Restaurants </option>
				</select>
				<br> -->
				<label>Find 
				<select id="subtype_select"> 
				</select>
				<span id="type">Restaurants</span>
				<br>
				<label>Find restaurants within <input type="number" id="radius" value="100" step="10"/> meters</label>
				<hr>
				<label for="count">There are <span id="count"></span> within <span class="radius">100</span> meters</label>
			</div>
    </div>
    <div id="right-panel"></div>
    <div id="map"></div>
	</body>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
	<script src="assets/js/main.js"></script>
	<script src="https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyBAxVfzlvsIwDlwmGYxYCh4TL4VjcANG3c" async defer></script>
</html>