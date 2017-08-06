//Google YouTube API Function
function start() {
  // 2. Initialize the JavaScript client library.
  gapi.client.init({
    'apiKey': 'AIzaSyC__E8TsENRXiRqAcxYB9-Uk8AwSSyVhqI',
    // Your API key will be automatically added to the Discovery Document URLs.
    'discoveryDocs': ['https://people.googleapis.com/$discovery/rest'],
    // clientId and scope are optional if auth is not required.
    'clientId': 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
    'scope': 'profile',
  }).then(function() {
    // 3. Initialize and make the API request.
    return gapi.client.people.people.get({
      'resourceName': 'people/me',
      'requestMask.includeField': 'person.names'
    });
  }).then(function(response) {
    console.log(response.result);
  }, function(reason) {
    console.log('Error: ' + reason.result.error.message);
  });
  //Test
  document.getElementById('test').innerHTML = 'YouTubeAPI loaded!';
  document.getElementById('test').style.color = 'red';
  document.getElementById('test').style.position = 'relative';
};

function wordToCloud() {

}

// 1. Load the JavaScript client library.
gapi.load('client', start);