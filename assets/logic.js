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
          $('.authuser').text('Welcome, '+ user.displayName + '.');
          $('.authuser-name').text(user.displayName + '\'s');
        }).catch(function(error){
          console.log('Error updating display name: ',error);
        });
        console.log('user name', user.displayName);
        console.log('user email', user.email);
        clearInputs(['#register-displayname','#register-email','#register-password']);
        $('#emailmodal').modal('close');
        $('#imgvault-show, #imgvault-grid').empty();
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
    $('#imgvault-show, #imgvault-grid').empty();
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
        $('.authuser').text('Welcome, '+ email + '.');
        $('.authuser-name').text(email + '\'s');
      } else {
        $('.authuser').text('Welcome, '+ displayName + '.');
        $('.authuser-name').text(displayName + '\'s');
      }

      // handle user database record
      writeUserData(uid,displayName,email);

      // listen for updates
      var userRef = db.ref('users/' + uid + '/vault/');
      userRef.on('value', function(snapshot){
        $('#imgvault-grid').empty();
        snapshot.forEach(function(childSnapshot){
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          console.log(childData.url);
          updateVault(uid, childKey, childData);
        });
        
      });

      
    } else {
      // User is signed out
      $('#authlogout').hide();
      $('#email-login').show();
    }
  });


  // Database Functions
  function updateVault(uid, key, data){
    var $div = $('<div>').attr('class','col s3');
    var $img = $('<a>').attr({
      'class': 'imgdisplay',
      'data-value': data.url
    });
    $img = $img.append($('<img>').attr({ 'src': data.url,'id': data.timestamp,'data-value': key, 'class': 'responsive-img' }));
    var $button = $('<button>').attr({
      'class': 'delbtn btn waves-effect waves-light red',
      'data-key': key,
      'data-uid': uid
    });
    $button = $button.append($('<i>').attr('class', 'material-icons').text('delete'));
    $div = $div.append($img).append($button);
    $('#imgvault-grid').append($div);
    
    //<a class="btn-floating btn-large waves-effect waves-light red"><i class="material-icons">add</i></a>
  }

  function writeUserData(uid,displayName,email) {
    db.ref('users/' + uid).update({
      displayname: displayName,
      email: email
    });
  }

  function pushUserImage(url){
    var user = firebase.auth().currentUser;
    var uid = user.uid;
    if (user != null) {
      var imgurl = {
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        url: url
      };
      var newImgKey = db.ref().child('users/' + uid + '/vault').push().key;

      var updates = {};
      updates['users/' + uid + '/vault/' + newImgKey] = imgurl;

      return db.ref().update(updates);
    }
  }

  // Logout Buttons
  // Email Logout
   $('#authlogout-btn').on('click',function(e){
     e.preventDefault();
     firebase.auth().signOut().then(function() {
       // Sign-out successful.
       console.log('Email user signed out.');
       $('#email-login').show();
       $('.authuser').text('');
       $('.authuser-name').text('My');
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

  function updatePicGrid(image, i, tweetinput, pubClass){
    // Building HTML elements for images
            var gridDiv = $("<div>");
            gridDiv.addClass("col m6");

            var imgOutsideDiv = $("<div>");
            imgOutsideDiv.addClass("card hoverable");

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
            publishLink.addClass("pubbtn picture waves-effect waves-light btn modal-trigger");
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

  }

  function callPixabay(result, tweetinput){
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
          updatePicGrid(image, i, tweetinput, pubClass);
          
        } // end for
      } // end error catching else
    }); // end ajax done function
  }


  $('#slapit-button').on("click", function(e) {
    e.preventDefault();
    $("#tweetgrid").empty();

    // trim the input value
    var tweet = $("#input").val().toLowerCase().trim().replace(/[^a-z0-9\s]/gi, '');
    var tweetinput = $('#input').val().trim();
    
    if (tweet.length > 0) {
      $('#input').val('');
      console.log(tweet);
      
      var result = parseInput(tweet);
      console.log('Parsed result: ', result);

      callPixabay(result, tweetinput);
      // ------------------------------------------------

     
     
    } else {
      $('#input').addClass('invalid');
      $('#inputlabel').text('Sorry, there was no text to slap. Write some text first.');
    }
  }); // end slapit-button click

  $('#kitten-button').on('click', function(e){
    e.preventDefault();
    $("#tweetgrid").empty();
     callPixabay('kitten', '#CATLIFE');
  });

  $('#input').focusin(function() {
    $('#inputlabel').text('Write some text to slap on an image.');
  });

  // cloudinary functions
  function doCloudinary(img,txt){
    console.log('doCloudinary with img: ', img);
    console.log('doCloudinary with txt: ', txt);

    // saveURL contains the final cloudinary URL to the image with text on it
    var saveURL = 'https://placehold.it/300x200'; 
    // return the saveURL back to where it was called
    return saveURL;
  }

  $(document).click(function(event){

    // track clicks for the generated Publish Buttons
    $(event.target).closest('.pubbtn').each(function(){
      var objid = '#' + this.id;
      var $this = $(this);
      console.log(objid + ' clicked!');
      var $picmodalContent = $('#picmodalContent');
      // $picmodalContent.attr({
      //   'style': 'background: url(\'' + $this.attr('data-img') + '\') 50% 50% no-repeat; background-size: cover;'
      // });
      var picimg = $('<img>').attr('src', $this.attr('data-img'));
      var pictxt = $('<p>').text($this.attr('data-txt'));
      var savebtn = $('<button>').attr({
        'class': 'savebtn waves-effect waves-light btn',
        'id': 'savethis',
        'data-img': $this.attr('data-img'),
        'data-txt': $this.attr('data-txt')
      }).text('Save SlapIt Image');
      $picmodalContent.text('').append(picimg).append(pictxt).append(savebtn);
    }); // end .pubbtn click check

    // track clicks for the generated Save button
    $(event.target).closest('.savebtn').each(function(){
      // this button is to save the cloudinary URL to the firebase database for the user

      var objid = '#' + this.id;
      var $this = $(this);
      console.log(objid + ' clicked!');

      // Store img and txt and pass to Cloudinary function
      var picimg = $this.attr('data-img');
      var pictxt = $this.attr('data-txt');
      console.log('Cloudinary URL: ', doCloudinary(picimg, pictxt));
      // Store return from Cloudinary function
      var url = doCloudinary(picimg, pictxt);
      // save link to db
      pushUserImage(url);
      $('#picmodal').modal('close');
      window.scrollTo(0, 0);
      setTimeout(function(){
        $('#usermsg').text('Your image has been saved to your vault.').addClass('light-green lighten-2').fadeIn();
      }, 500);
      setTimeout(function(){
        $('#usermsg').fadeOut();
      }, 5000);

    });

    // track clicks for the generated Delete buttons
    $(event.target).closest('.delbtn').each(function(){
      console.log('Delete button clicked!');
      var $this = $(this);
      var key = $this.attr('data-key');
      var uid = $this.attr('data-uid');

      db.ref('users/' + uid + '/vault/' + key).remove();
      
    });

    // track clicks on image vault images
    $(event.target).closest('.imgdisplay').each(function(){
      console.log('Image preview clicked!');
      var $this = $(this);
      var $imgshow = $('#imgvault-show');
      $imgshow.empty();
      $imgshow.append(
        $('<img>').attr({
          'class': 'responsive-img',
          'src': $(this).attr('data-value')
        })
      );
    });

  });


}); // end document ready