// _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_
// Global Variables / Constants
// _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_

var cloudArr = [];
var locationToggle = false;

// _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_
// Initialize Google API function
// _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_

//Initialize, set submit function, use API
function start() {
  gapi.client.init({
    'apiKey': 'AIzaSyC__E8TsENRXiRqAcxYB9-Uk8AwSSyVhqI'
  }).then(() => {
    $('#searchForm').submit((e) => {
      e.preventDefault(); // <=========  Stops page refresh.

      // Load YouTubeAPI, THEN call for a request, show results.
      gapi.client.load('youtube', 'v3').then(() => {
        makeRequest();
        document.getElementById('resultDiv').style.display = 'inline-block';
      });
    });
  });
}

// _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_
// Request function
// _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_

function makeRequest() {
  // Declare parameters for request.
  var q = document.getElementById('keywordBar').value;
  var orderType = document.getElementById('orderDropdown').value;
  var maxResults = 10;

  var request;


  // Make sure I'm getting the right values for my parameters.
  // console.log(orderType);

  // Check to use location-parameters or normal parameters
  if (locationToggle == true) {

    var locationString = document.getElementById('latitudeText').value + ',' + document.getElementById('longitudeText').value;

    // Checked to make sure location formatted correctly.
    // console.log(locationString);

    request = gapi.client.youtube.search.list({
      q: q,
      safeSearch: 'strict',
      part: 'snippet',
      relevanceLanguage: 'en-US',
      maxResults: maxResults,
      type: 'video',
      order: orderType,
      regionCode: 'US',
      location: locationString,
      locationRadius: document.getElementById('radiusText').value + document.getElementById('radiusUnit').value
    });
  } else {
    request = gapi.client.youtube.search.list({
      q: q,
      safeSearch: 'strict',
      part: 'snippet',
      relevanceLanguage: 'en-US', 
      maxResults: maxResults,
      type: 'video',
      order: orderType,
      regionCode: 'US'
    });
  }

  // Execute and send the request, GET the response.
  request.execute((response) => {      
    
    // Logs the response of the request for Development purposes.
    // console.log(response);

    var results = $('#resultDiv');
    results.empty();
    var searchItems = response.result.items; 

    results.append('<h3>Results (Top ' + maxResults + '):</h3>')
    
    searchItems.forEach((item) => {
      vidTitleSnippet = item.snippet.title
      vidTitle = '<span class="videoTitle">' + item.snippet.title + '</span>';

      //Add title words to word cloud
      titleToArr(item, cloudArr);

      vidDesc = '<span class="videoDesc">' + item.snippet.description + '</span>';
      vidThumb = '<a class="infoLink" href="https://youtube.com/watch?v=' + item.id.videoId + '" target="_blank" >' + '<img class="videoThumb" src="' + item.snippet.thumbnails.medium.url + '" alt="No Image Available.">' + '</a>';                 
      results.append('<hr>' + '<div>' + vidThumb + '<div class="videoInfo">' + '<a class="infoLink" href="https://youtube.com/watch?v=' + item.id.videoId + '" target="_blank" >' + vidTitle + '</a>' + '<br>' + vidDesc + "</div>" + '</div>');                      
    });
    if (searchItems.length == 0) {
      results.append('<hr><p style="color:red;">Oh no! Looks like there\'s no results.</p>');
    }
    wordsToCloud(cloudArr);  
  });
}

// _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_
// Word-Cloud Functions!!
// _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_

// Break title into words and sort into an object array for D3 - Algorithm
function titleToArr(video, wordArr) {
  var vidTitleArr = video.snippet.title.replace(/[.,\/#!$%\^&\*\'\";:{}\[\]=\-_`~()]/g,"").toLowerCase().split(' ');
  
  console.log('This is the vid title: ', vidTitleArr);

  // ALGORITHM

  // For each word in the title..
  vidTitleArr.forEach((word) => {

    // ..if the wordArr is empty, just add it..
    if (wordArr.length == 0) {
      if (word != '') {
        wordArr.push({text: word, size: 100});
      }
    } 
    // ..else: if the wordArr already has the word, find the object and increase its size.. ELSE, add it 
    else {
      var found = false;
      var index;
      for(var i = 0; i < wordArr.length; i++) {
        if (wordArr[i].text == word) {
          found = true;
          index = i;
          break;
        }
      }
      if (found) {
        wordArr[index].size++;
      } else {
        if (word != '') {
          wordArr.push({text: word, size: 100});
        }
      }
    }
  });
}

// Create word-cloud into HTML, reset wordbank when done ----- stop when you add page-switches
function wordsToCloud(wordArr) {
  // Testing my wordbank
  wordArr.forEach((item) => {
    console.log(item);
  });

  $('#word-cloud').empty();
  d3.wordcloud().size([600, 800]).selector('#word-cloud').words(wordArr).scale('log').font('Verdana').start();
  wordArr.length = 0;
}

// _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_
// HTML-CSS Javascript DOM Manipulation
// _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_

// Input enable/disable functions
// -----------------------------------------------------------
// Views
function ifDisabledMin() {
  var elem = document.getElementById('rangeTextMin');
  elem.disabled = !elem.disabled;
}

function ifDisabledMax() {
  var elem = document.getElementById('rangeTextMax');
  elem.disabled = !elem.disabled;
}

// Location
function ifDisabledLocation() {
  longitudeBox = document.getElementById('longitudeText');
  latitudeBox = document.getElementById('latitudeText');
  radiusInput = document.getElementById('radiusText');
  radiusUInput = document.getElementById('radiusUnit');

  longitudeBox.disabled = !longitudeBox.disabled;
  latitudeBox.disabled = !latitudeBox.disabled;
  radiusInput.disabled = !radiusInput.disabled;
  radiusUInput.disabled = !radiusUInput.disabled;

  longitudeBox.required = !longitudeBox.required;
  latitudeBox.required = !latitudeBox.required;
  radiusInput.required = !radiusInput.required;

  // Toggle on/off the location-requests.
  locationToggle = !locationToggle;
}

// _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_
// Run some functions on start.
// _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_

// Loads Google API, callback: start()
gapi.load('client', start);