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

var parameter = "kittens";
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

//Handle authenticated users
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
    $('#ttr-login').hide();
    $('#ttr-login-popup').hide();
    $('#authuser').html('<i class="material-icons">person</i> Welcome, '+ email);
    $('#authlogout').css('display','inline-block');
  }
});

// Email Logout
$('#authlogout').on('click',function(e){
  e.preventDefault();
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    console.log('Email user signed out.');
    $('#email-login').css('display','inline-block');
    $('#ttr-login').css('display','inline-block');
    $('#ttr-login-popup').css('display','inline-block');
    $('#authuser').text('');
    $('#authlogout').hide();
  }, function(error) {
    console.log('Error in email logout: ', error);
  });
});

//Twitter authentication in Firebase
var provider = new firebase.auth.TwitterAuthProvider();
$('#ttr-login').on('click', function(e){
    e.preventDefault();
    console.log('Signin with redirect?');
    firebase.auth().signInWithRedirect(provider);
    firebase.auth().getRedirectResult().then(function(result) {
      if (result.credential) {
        // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
        // You can use these server side with your app's credentials to access the Twitter API.
        var token = result.credential.accessToken;
        var secret = result.credential.secret;
        // ...
      }
      // The signed-in user info.
      var user = result.user;
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
$('#ttr-login-popup').on('click', function(e){
    e.preventDefault();
    console.log('Sign in with Popup...');
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
      // You can use these server side with your app's credentials to access the Twitter API.
      console.log('Getting Twitter stuff...')
      var token = result.credential.accessToken;
      console.log('Token: ', token);
      var secret = result.credential.secret;
      console.log('Secret: ', secret);
      // The signed-in user info.
      var user = result.user;
      console.log('User: ', user);
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('Error: ', errorCode, errorMessage);
      // The email of the user's account used.
      var email = error.email;
      console.log('Error email: ', email);
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
      console.log('Error Credential: ', credential);
    });
});

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

    	var tweet = $("#input").val().trim();
    	console.log(tweet);

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


    	publishLink.attr({
        href: '#picmodal',
        class: 'modal-trigger'
      });

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


    	}
    });



	})








    

});