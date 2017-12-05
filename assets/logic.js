// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "ready!" );

// global variables

var parameter = "kittens"

// API Keys and URLS

// Twitter API Authenticate and URL (code here)

// Pixabay (limites to 100char search) key and URL
var pixaAPIKey = "7257370-30b7aa653946a15e7e86ea83c"
var pixabayQueryURL = "https://pixabay.com/api/?key=" + pixaAPIKey + "&q=" + parameter

// twitter ajax call/ 'on click' (code here)
	$(document).on("click", function() {

	$.ajax({
        url: pixabayQueryURL,
        method: "GET"
    }).done(function(pixabayData) {

    // Logging the URL so we have access to it for troubleshooting     
    console.log("------------------------------------");     
    console.log("URL: " + pixabayQueryURL);     
    console.log("------------------------------------");
    
    // Log the pixabayData to console, where it will show up as an object     
    console.log(pixabayData);     
    console.log("------------------------------------");

    console.log(pixabayData.hits.length);

    for (var i = 0; i < pixabayData.hits.length; i++) {

    	console.log("yes");

    	var image = pixabayData.hits[i].webformatURL;

    	var returnImage = $("<img>");
    	returnImage.attr("src", image);


    	
    	$(".card-image").html(returnImage);

    	}
    });

	})










});