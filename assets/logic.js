// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "ready!" );

// global variables

var parameter = "kittens"

// API Keys and URLS

// Twitter API Authenticate and URL (code here)

// Pixabay key and URL
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

    for (var i = 0; i < pixabayData.length; i++) {

    	console.log("yes");

    	var imageDiv = $("<div>");

    	var image = pixabayData[i].webformatURL;

    	var returnImage = $("<img>");
    	returnImage.attr("src", image);
    	returnImage.addClass(tweetoImage);


    	imageDiv.append(returnImage);
    	$("#target").append(imageDiv);

    	}
    });

	})










});