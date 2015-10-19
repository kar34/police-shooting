// Global variables
var whiteMale = 0;
var whiteFemale = 0; //represents female + unknown in the table
var nwMale = 0;
var nwFemale = 0; //represents female + unknown in the table
var map;


// Function to draw your map
var drawMap = function() {
    // Create map
    map = L.map('map').setView([38, -99], 5);
    var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
    layer.addTo(map);
    getData();
};

// Function for getting data
var getData = function() {

    // Execute an AJAX request to get the data in data/response.js
	$.ajax({  
		url: ('data/response.json'),
		type:"get",
		success: function(data) { customBuild(data); }
	});

};

// Loop through your data and add the appropriate layers and points
var customBuild = function(data) {
	// Be sure to add each layer to the map

	var name;
	var race;
	var gender;
	var status;
	var summary;

	var hitLayer = new L.LayerGroup([]);
	var killLayer = new L.LayerGroup([]);

	// loops through data
	for (var count = 0; count < data.length; count++) {

		// Grabs the race
		if (data[count]["Race"] == "undefined")
			race = "Unknown";
		else
			race = data[count]["Race"];

		// Grabs the gender 
		if (data[count]["Victim's Gender"] == "Male")
			gender = "Male";
		else if (data[count]["Victim's Gender"] == "Female") 
			gender = "Female";
		else 
			gender = "Unknown";

		// Grabs the status (hit or killed)
		if (data[count]["Hit or Killed?"] == "undefined")
			status = "Unknown";
		else 
			status = data[count]["Hit or Killed?"];

		// Grabs the location
		var latitude = data[count]["lat"];
		var longitude = data[count]["lng"];

		// Grabs summary
		if (data[count]["Summary"] == "undefined")
			summary = "There is no summary information at this time.";
		else
			summary = data[count]["Summary"];

		// Updates table information
		if (gender == "Male") {
			if (race == "White")
				whiteMale++;
			else
				nwMale++;
		} else {
			if (race == "White")
				whiteFemale++;
			else
				nwFemale++;
		}
		$("#whiteMale").text(whiteMale);
		$("#whiteFemale").text(whiteFemale);
		$("#nwMale").text(nwMale);
		$("#nwFemale").text(nwFemale);

		// More info popup
		var moreInfo = new L.popup({
			maxHeight: 350
		}).setLatLng(latitude, longitude).setContent(moreInfo);

		// Creates point at crime location and adds appropriate layer
		if (status == "Hit") 
			var circle = new L.circle([latitude, longitude], 500, {color: "#000000", fillColor: "#000000"}).addTo(hitLayer).bindPopup(moreInfo);
		else
			var circle = new L.circle([latitude, longitude], 500, {color: "#FF0000", fillColor: "#FF0000"}).addTo(killLayer).bindPopup(moreInfo);
	}

	// Once layers are on the map, add a leaflet controller that shows/hides layers
	var mapLayers = {
		"hit" : hitLayer,
		"kill" : killLayer
	};	
	L.control.layers(null, mapLayers).addTo(map);  
};


