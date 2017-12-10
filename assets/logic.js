// A $( document ).ready() block.
$( document ).ready(function() {
  console.log( "ready!" );
  // console.log(junk);

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

  // Email registration
  $('#register-submit').on('click', function(e){
    e.preventDefault();
    var email = $('#register-email').val().trim();
    var password = $('#register-password').val().trim();
    var displayname = $('#register-displayname').val().trim();
    console.log('displayname',displayname);
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .catch(function(error){
      console.log('Error in email registration: ',error);
      $('#label-register-email').text('Email already in use, choose another.');
      $('#register-email').addClass('invalid');
    }).then(function(){
      var user = firebase.auth().currentUser;
      if (user != null) {
        user.updateProfile({
          displayName: displayname
        }).then(function(){
          console.log('User display name updated: ',user.displayName);
          $('#authuser').text('Welcome, '+ user.displayName + '.');
        }).catch(function(error){
          console.log('Error updating display name: ',error);
        });
        console.log('user name', user.displayName);
        console.log('user email', user.email);
        clearInputs(['#register-displayname','#register-email','#register-password']);
        $('#emailmodal').modal('close');
      }
    });
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
    clearInputs(['#login-email','#login-password']);
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
      $('#authlogout').css('display','inline-block');
      if (user.displayName === null) {
        $('#authuser').text('Welcome, '+ email + '.');
      } else {
        $('#authuser').text('Welcome, '+ displayName + '.');
      }
      
    } else {
      // User is signed out
      $('#authlogout').hide();
      $('#email-login').show();
    }
  });

  // Logout Buttons
  // Email Logout
   $('#authlogout').on('click',function(e){
     e.preventDefault();
     firebase.auth().signOut().then(function() {
       // Sign-out successful.
       console.log('Email user signed out.');
       $('#email-login').show();
       $('#authuser').text('');
       $('#authlogout').hide();
     }, function(error) {
       console.log('Error in email logout: ', error);
     });
   });


  // UI Stuff
  $('.modal').modal();
  $('input#register-displayname, input#input').characterCounter();

  function clearInputs(arr){
    $(arr).each(function(i,v){
      $(v).val('');
    });
  }


  // twitter ajax call/ 'on click' (code here)

  function parseInput(res){
    arr = res.split(' ');
    // pull out junk words
    for (var j = arr.length -1; j >= 0; j--) {
      for (var k = junk.length - 1; k >= 0; k--) {
        if (arr[j] === junk [k]) {
          arr.splice(j, 1);
        }
      }
    }
    // create search text
    var result = '';
    // limit search terms
    result = arr[0];

    console.log("Final result: ",result);
    return result;

  }

  $('#kitten-button').on("click", function() {

    $("#tweetgrid").empty();

    // trim the input value
    var tweet = $("#input").val().toLowerCase().trim().replace(/[^a-z0-9\s]/gi, '');
    var tweetinput = $('#input').val().trim();
    if (tweet.length > 0) {
      console.log(tweet);
      
      var result = parseInput(tweet);
      console.log(result);

      // ------------------------------------------------

      // Authenticated user - if not logged in, don't allow publish
      var user = firebase.auth().currentUser;
      var pubClass = false;
      if (user != null) {
        pubClass = true;
      }

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

        var resLength = pixabayData.hits.length;
        console.log(resLength);

        if (resLength <= 0) {
          $('#input').addClass('invalid');
          $('#inputlabel').text('Oh crap. This is.. super embarassing. We couldn\'t find an image for the amazing text that you wrote. Try some different text, and we\'ll try again.');
        } else {
          // do the thing
          for (var i = 0; i < pixabayData.hits.length; i++) {

            console.log("yes");

            var image = pixabayData.hits[i].webformatURL;

            // Building HTML elements for images
            var gridDiv = $("<div>");
            gridDiv.addClass("col m6");

            var imgOutsideDiv = $("<div>");
            imgOutsideDiv.addClass("card");

            var imgDiv = $("<div>");
            imgDiv.addClass("card-image");
            imgDiv.attr({
              'id': "img" + i,
              'style': 'min-height: 300px'
            });

            var newImage = $("<img>");
            newImage.addClass("responsive-img");
            newImage.attr({
              "style": "height: 300px; width: auto;",
              "src": image,
              "alt": "broken image"
            });

            var title = $("<span>");
            title.addClass("card-title");
            title.attr({
              "style": "text-shadow: 1px 1px 2px black;"
            });
            title.text(tweetinput);


            var publish = $("<div>");
            publish.addClass("card-action");

            var publishLink = $("<button>");
            publishLink.addClass("clickable picture waves-effect waves-light btn modal-trigger");
            publishLink.attr({
              'href': "#picmodal",
              'data-img': image,
              'data-txt': tweetinput,
              'id': 'publishimg' + i
            });
            publishLink.text("Publish");

            if (!pubClass) {
              publish.attr('title','Sorry, you must be logged in to do this.');
              publishLink.addClass('disabled');
            }

            // order elements
            gridDiv.append(imgOutsideDiv);
            imgOutsideDiv.append(imgDiv);
            imgDiv.append(newImage);
            imgDiv.append(title);
            // imgOutsideDiv.append(tweetTextDiv);
            // tweetTextDiv.append(tweetText);
            imgOutsideDiv.append(publish);
            publish.append(publishLink);

            $("#tweetgrid").append(gridDiv);
          } // end for
        } // end error catching else
      }); // end ajax done function
    } else {
      $('#input').addClass('invalid');
      $('#inputlabel').text('Sorry, there was no text to slap. Write some text first.');
    }
  }); // end kitten button click

  $('#input').focusin(function() {
    $('#inputlabel').text('Write some text to slap on an image.');
  });

  $(document).click(function(event){
    $(event.target).closest('.clickable').each(function(){
      var objid = '#' + this.id;
      var $this = $(this);
      console.log(objid + ' clicked!');
      var $picmodalContent = $('#picmodalContent');
      // $picmodalContent.attr({
      //   'style': 'background: url(\'' + $this.attr('data-img') + '\') 50% 50% no-repeat; background-size: cover;'
      // });
      var picimg = $('<img>').attr('src', $this.attr('data-img'));
      var pictxt = $('<p>').text($this.attr('data-txt'));
      $picmodalContent.text('').append(picimg).append(pictxt);


    });
  });


}); // end document ready