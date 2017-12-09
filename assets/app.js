// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "ready!" );

console.log(junk);

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
// Email + Password authentication in Firebase
$('.modal').modal();
// Email registration
$('#register-submit').on('click', function(e){
  e.preventDefault();
  var email = $('#register-email').val().trim();
  var password = $('#register-password').val().trim();
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .catch(function(error){
    console.log('Error in email registration: ',error);
  });
  $('#register-email').val('');
  $('#register-password').val('');
  $('#emailmodal').modal('close');
});
// Email login
$('#login-submit').on('click', function(e){
  e.preventDefault();
  var email = $('#login-email').val().trim();
  var password = $('#login-password').val().trim();
  firebase.auth().signInWithEmailAndPassword(email, password)
  .catch(function(error){
    console.log('Error in email login: ',error);
  });
  $('#login-email').val('');
  $('#login-password').val('');
  $('#emailmodal').modal('close');
});
// Handle authenticated users
firebase.auth().onAuthStateChanged(function(user){
  if (user) {
    // User is authenticated
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    $('#email-login').hide();
    $('#authuser').text('Welcome, '+ email);
  }
});
// Twitter authentication in Firebase
var provider = new firebase.auth.TwitterAuthProvider();
$('#ttr-login').on('click', function(e){
    e.preventDefault();
    console.log('#sm# login clicked');
    console.log('Sign in with Popup...');
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
      // You can use these server side with your app's credentials to access the Twitter API.
      console.log('Getting Twitter stuff...')
      var token = result.credential.accessToken;
      var secret = result.credential.secret;1
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
});

// twitter ajax call/ 'on click' (code here)
	$('#kitten-button').on("click", function() {

	$("#tweetgrid").empty();

	// trim the input value

    var tweet = $("#input").val().toLowerCase().trim();
    console.log(tweet);

    var res = tweet.split(" ");

	console.log(res);

	// Pull junk words out of string
	for (var j = res.length - 1; j >= 0; j--) {
	

		for (var k = junk.length - 1; k >= 0; k--) {
		 
		if (res[j] === junk[k]) {
			res.splice(j, 1);
		};
		};
	};
	console.log(res);
	var result = res.join('+');
	console.log(result);
	// ------------------------------------------------

	// Pixabay (limites to 100char search) key and URL
	var pixaAPIKey = "7257370-30b7aa653946a15e7e86ea83c";
	var pixabayQueryURL = "https://pixabay.com/api/?key=" + pixaAPIKey + "&q=" + result;

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

		// Building HTML elements for images

    	var gridDiv = $("<div>");
    	gridDiv.addClass("col m4");

    	var imgOutsideDiv = $("<div>");
    	imgOutsideDiv.addClass("card");

    	var imgDiv = $("<div>");
    	imgDiv.addClass("card-image");
    	imgDiv.attr("id", "img" + i);

    	var newImage = $("<img>");
    	newImage.addClass("responsive-img");
    	newImage.attr({
    		"style": "background-size: cover; height: 200px; width: 200px;",
    		"src": image,
    		"alt": "broken image"
    	});

    	var title = $("<span>");
    	title.addClass("card-title");
    	title.text(tweet);

    	var tweetTextDiv = $("<div>");
    	tweetTextDiv.addClass("card-content");

    	var tweetText = $("<p>");
    	tweetText.text("Tweets Go Here!");

    	var publish = $("<div>");
    	publish.addClass("card-action");

    	var publishLink = $("<a>");
    	publishLink.addClass("clickable picture waves-effect waves-light btn modal-trigger");
    	publishLink.attr("href", "#picmodal");
    	publishLink.text("Publish to Twitter");


    	// order elements
    	gridDiv.append(imgOutsideDiv);
    	imgOutsideDiv.append(imgDiv);
    	imgDiv.append(newImage);
    	imgDiv.append(title);
    	imgOutsideDiv.append(tweetTextDiv);
    	tweetTextDiv.append(tweetText);
    	imgOutsideDiv.append(publish);
    	publish.append(publishLink);




    	$("#tweetgrid").append(gridDiv);


    	};
    });



	});



    

});