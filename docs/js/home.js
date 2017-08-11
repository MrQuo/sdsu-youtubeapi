var wordArray = [];
var location = false;

// Intialize YouTubeAPI functions.
function start() {
  gapi.client.init({
    'apiKey': 'AIzaSyAWE2mRXRb0_VS8TXk1xOkcVWUHsZxwImI'
  }).then(() => {
    $('#searchForm').submit((e) => {
      e.preventDefault(); // Stops refresh.

      gapi.client.load('youtube', 'v3').then(() => {
        makeRequest();
        document.getElementById('resultDiv').style.display = 'inline-block';
        wordToCloud();
      });
    });
  });
}

// The request with input data.
function makeRequest() {
  var q = document.getElementById('keywordBar').value;
  var orderType = document.getElementById('orderDropdown').value;
  
  console.log(orderType);

  if (location) {
    var request = gapi.client.youtube.search.list({
      q: q,
      safeSearch: 'strict',
      part: 'snippet',
      relevanceLanguage: 'en-US', 
      maxResults: 10,
      type: 'video',
      order: orderType,
      regionCode: 'US',
      location: ('(' + $('#longitudeText').value + ', ' + $('#latitudeText').value + ')'),
      locationRadius: $('#radiusText').value
    });
  } else {
    var request = gapi.client.youtube.search.list({
      q: q,
      safeSearch: 'strict',
      part: 'snippet',
      relevanceLanguage: 'en-US', 
      maxResults: 10,
      type: 'video',
      order: orderType,
      regionCode: 'US'
    });
  }

  request.execute((response) => {      
    console.log(response);

    var results = $('#resultDiv');
    results.empty();
    var searchItems = response.result.items; 

    results.append('<p>Results:</p>')
    
    searchItems.forEach((item) => {
      vidTitleSnippet = item.snippet.title
      vidTitle = '<span class="videoTitle">' + item.snippet.title + '</span>';
      //Add title words to word cloud
      vidTitleSnippet.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(' ').forEach((word) => {
        if (wordArray.length == 0) {
          wordArray.push({text: word, size: 1});
        } else {
          var bool = false;
          for (var a = 0; a < wordArray.length; a++) {
            if (wordArray[a].text == word) {
              wordArray[a].size++;
              bool = true;
              break;
            }
          }
          if (bool) {
            wordArray.push({text: word, size: 1});
          }
        }
      });

      vidDesc = '<span class="videoDesc">' + item.snippet.description + '</span>';
      vidThumb = '<img class="videoThumb" src="' + item.snippet.thumbnails.default.url + '" alt="No Image Available.">';                 
      results.append('<div>' + vidThumb + '<div class="videoInfo">' + vidTitle + '<br>' + vidDesc + "</div>" + '</div>' + '<hr>');                      
    });  
  });  
}

// Create word-cloud.
function wordToCloud() {
  console.log(wordArray);
  $('#word-cloud').empty();
  d3.wordcloud().size([200, 200]).selector('#word-cloud').words(wordArray).start();
}

// Checkbox input enable disable
function ifDisabledMin() {
  var elem = document.getElementById('rangeTextMin');
  elem.disabled = !elem.disabled;
}

function ifDisabledMax() {
  var elem = document.getElementById('rangeTextMax');
  elem.disabled = !elem.disabled;
}

function ifDisabledLocation() {
  longitude = $('#longitudeText');
  latitude = $('#latitudeText');
  radius = $('#radiusText');

  longitude.disabled = !longitude.disabled;
  latitude.disabled = !latitude.disabled;
  radius = !radius.disabled;
  location = !location;
}

// Google API ready check. Call the initializations.
gapi.load('client', start);