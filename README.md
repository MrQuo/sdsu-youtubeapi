# a youtube data api test

While social media is growing and connecting people across the world, San Diego State University's [HDMA Center](https://humandynamics.sdsu.edu/) is using new developments in geospatial science, mobile technology, and Big Data to uncover the spatial and temporal relationships to explain human behavior, public health, and other activities around the world.

The website is my test of Google's YouTube Data API v3 and the information it can provide for social media research as part of SDSU's growing research in human behavior. I had an idea that popular culture and trends can be seen through videos' titles.

Check out the [**online demo**](https://jnarezo.github.io/sdsu-youtubeapi/)!

### What it does
The website makes a wordcloud of the words used in the first 10 video titles that show in search.
This displays different words' frequency of appearing in the top video titles.

The data is retrieved from a query based on the following implemented filters:
* **Keywords** - filter data based on keywords in the title
* **Sort Order** - sort by *View Count*, *Relevance*, *Rating*, *Date*, *Title*
* **Location** - use data from videos in a *radius* around a point on Earth (latitude, longitude)

### Credits and Support
I want to give credit for the wordcloud library [here](https://github.com/jasondavies/d3-cloud), by Jason Davies.

Thanks for all the support of everyone at the HDMA Center, especially Dr. Tsou.
