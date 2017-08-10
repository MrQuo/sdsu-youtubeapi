//Google YouTube API Function
$('#searchForm').submit(function(e) {
  e.preventDefault();
  gapi.client.setApiKey('AIzaSyC__E8TsENRXiRqAcxYB9-Uk8AwSSyVhqI');
  gapi.client.load('youtube', 'v3', function() {
    makeRequest();
  });

  document.getElementById('test').innerHTML = 'YouTubeAPI loaded!';
  document.getElementById('test').style.color = 'red';
  document.getElementById('test').style.position = 'relative';
});

function makeRequest() {
        var q = document.getElementById('searchBar').value;
        var request = gapi.client.youtube.search.list({
                q: q,
                part: 'snippet', 
                maxResults: 10
        });
        request.execute(function(response)  {                                                               
                var results = document.getElementById('resultDiv');
                var srchItems = response.result.items;                      
                srchItems.forEach(function(index, item) {
                vidTitle = item.snippet.title;  
                vidThumburl =  item.snippet.thumbnails.default.url;                 
                vidThumbimg = '<pre><img id="thumb" src="'+vidThumburl+'" alt="No  Image Available." style="width:204px;height:128px"></pre>';                   

                results.append('<pre>' + vidTitle + vidThumbimg +  '</pre>');                      
        });  
    });  
}

function wordToCloud() {

}

function ifDisabled() {
  document.getElementById('rangeTextMin').disabled = !(document.getElementById('rangeTextMin').disabled)
  // document.getElementById('rangeRange').disabled = !(document.getElementById('rangeRange').disabled)
}

function ifDisabledMax() {
  document.getElementById('rangeTextMax').disabled = !(document.getElementById('rangeTextMax').disabled)
  // document.getElementById('rangeRange').disabled = !(document.getElementById('rangeRange').disabled)
}

function updateTextV(value) {
  document.getElementById('rangeTextMax').value = value;
}

function updateRangeV(value) {
  document.getElementById('rangeRange').value = value;
}

// 1. Load the JavaScript client library.