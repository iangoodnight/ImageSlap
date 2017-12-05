// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "ready!" );

// global variables
// Initialize Firebase
var config = {
    apiKey: "AIzaSyB62jW1JBdl6TtmzyPFra3-R4oJjRraoeM",
    authDomain: "tweeto-fdba7.firebaseapp.com",
    databaseURL: "https://tweeto-fdba7.firebaseio.com",
    projectId: "tweeto-fdba7",
    storageBucket: "tweeto-fdba7.appspot.com",
    messagingSenderId: "155287704892"
};
firebase.initializeApp(config);

var db = firebase.database();
var parameter = "kittens"

// Twitter authentication in Firebase
var provider = new firebase.auth.TwitterAuthProvider();
$('#ttr-login').on('click', function(e){
    e.preventDefault();
    console.log('#sm# login clicked');
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
      // You can use these server side with your app's credentials to access the Twitter API.
      var token = result.credential.accessToken;
      var secret = result.credential.secret;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
})

// API Keys and URLS

// Twitter API Authenticate and URL (code here)

// Pixabay (limites to 100char search) key and URL
var pixaAPIKey = "7257370-30b7aa653946a15e7e86ea83c"
var pixabayQueryURL = "https://pixabay.com/api/?key=" + pixaAPIKey + "&q=" + parameter

// twitter ajax call/ 'on click' (code here)
	$('#kitten-button').on("click", function() {

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