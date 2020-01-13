// Global Variables
var g_words = [];
var g_useLocation = false;

// Initializes Google API
function start() {
  gapi.client.init({
    'apiKey': 'AIzaSyDJaKmkZTLl0ZUOO1t9G5HrLiomWCPn0n4' // Restricted key for Github Pages.
  }).then(() => {
    // Query YouTube Data API when search is sent
    document.getElementById('searchForm').addEventListener('submit', (e) => {
      e.preventDefault();
      gapi.client.load('youtube', 'v3').then(() => {
        formatAPIRequest(10).execute((response) => {
          showResults(response);
        });
        document.getElementById('resultDiv').style.display = 'inline-block';
      });
    });
  });
}

// Creates a pending YouTube Data API request/query with the chosen filters.
function formatAPIRequest(maxResults = 10) {
  var filters = {
    part: 'snippet',
    q: document.getElementById('keywordBar').value,
    safeSearch: 'strict',
    relevanceLanguage: 'en-US',
    maxResults: maxResults,
    type: 'video',
    order: document.getElementById('orderDropdown').value,
    regionCode: 'US'
  };
  if (g_useLocation) {
    filters.location = document.getElementById('latitudeText').value + ','
                        + document.getElementById('longitudeText').value;
    filters.locationRadius = document.getElementById('radiusText').value
                              + document.getElementById('radiusUnit').value;
  }

  return gapi.client.youtube.search.list(filters);
};

// Displays YouTube Data API search results from the response.
function showResults(response) {
  var results = $('#resultDiv');
  var responseItems = response.result.items;
  
  results.empty();
  if (responseItems.length == 0) {
    results.append('<hr><p style="color:red;">Oh no! It looks like there\'s no results.</p>');
  } else {
    // Show results in the results element and add the title to the wordcloud list.
    results.append('<h3>Results: (Showing first ' + responseItems.length + ')</h3>')
    g_words = [];
    responseItems.forEach((item) => {
      vidLink = 'https://youtube.com/watch?v=' + item.id.videoId
      vidTitle = '<span class="videoTitle">' + item.snippet.title + '</span>';
      vidDesc = '<span class="videoDesc">' + item.snippet.description + '</span>';
      vidThumb = '<a class="infoLink" href="' + vidLink + '" target="_blank" >'
                  + '<img class="videoThumb" src="' + item.snippet.thumbnails.medium.url
                  + '" alt="No Image Available."' + '></a>';
      results.append('<hr>' + '<div>' + vidThumb + '<div class="videoInfo">'
                      + '<a class="infoLink" href="' + vidLink + '" target="_blank" >'
                      + vidTitle + '</a>' + '<br>' + vidDesc
                      + "</div>" + '</div>');
      addToWordCount(item.snippet.title);
    });
  }
  updateWordCloud();
}

// Appends any "word" in a string to the given array.
function addToWordCount(string) {
  // Split words, names, or terms in titles
  var words = string.toLowerCase().replace(/[^\w#$\'\’\-]+/g,'.').split('.');
  g_words = g_words.concat(words);
}

// Update the wordcloud contents and draw on webpage.
function updateWordCloud() {
  var wordCloud = [];
  var wordFreq = getFrequencyDict(g_words);

  // Build D3 word-cloud object
  Object.keys(wordFreq).forEach((word) => {
    wordCloud.push({
      'text': word,
      'size': wordFreq[word] * 180 // px sqrt scale
    });
  });

  // Redraw cloud
  $('#word-cloud').empty().append('<h3>Word Cloud of Titles: </h3>');
  d3.layout.cloud().size([700, 300])
      .words(wordCloud)
      .fontSize(function(d) { return Math.sqrt(d.size); })
      .rotate(0)
      .on('end', drawCloud)
      .start();
}

// Draw D3 wordcloud on webpage.
function drawCloud(items) {
  d3.select('#word-cloud')
    .append('svg').attr('width', 650).attr('height', 240).attr('class', 'wordcloud')
    .append('g').attr('transform', 'translate(250,120)').selectAll('text')
    .data(items).enter()
    .append('text')
    .style('font-size', function(d) { return d.size + 'px'; })
    .style('fill', '#000')
    .attr("transform", function(d) {
      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .text(function(d) { return d.text; });
}

// Returns a frequency dictionary of array's items (key) and occurences (value).
function getFrequencyDict(arr) {
  var dictionary = {};
  arr.forEach((item) => {
    if (dictionary[item] === undefined) {
      dictionary[item] = 1;
    } else {
      dictionary[item] = dictionary[item] + 1;
    }
  });

  return dictionary;
}

// Toggles minimum range search filter
function toggleMin() {
  var minInput = document.getElementById('rangeTextMin');
  minInput.disabled = !minInput.disabled;
}

// Toggles maximum range search filter
function toggleMax() {
  var maxInput = document.getElementById('rangeTextMax');
  maxInput.disabled = !maxInput.disabled;
}

// Toggles geolocation search filter
function toggleLocation() {
  var longitudeBox = document.getElementById('longitudeText');
  var latitudeBox = document.getElementById('latitudeText');
  var radiusInput = document.getElementById('radiusText');
  var unitInput = document.getElementById('radiusUnit');

  longitudeBox.disabled = !longitudeBox.disabled;
  latitudeBox.disabled = !latitudeBox.disabled;
  radiusInput.disabled = !radiusInput.disabled;
  unitInput.disabled = !unitInput.disabled;

  longitudeBox.required = !longitudeBox.required;
  latitudeBox.required = !latitudeBox.required;
  radiusInput.required = !radiusInput.required;

  g_useLocation = !g_useLocation;
}

// _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_
// Post-Declarations
// _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_

document.getElementById('viewToggleMin').addEventListener('change', (e) => {
  toggleMin();
});

document.getElementById('viewToggleMax').addEventListener('change', (e) => {
  toggleMax();
});

document.getElementById('locationToggle').addEventListener('change', (e) => {
  toggleLocation();
});

gapi.load('client', start);
