require("dotenv").config();
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
const Spotify = require("node-spotify-api");
const keys = require("./keys.js");
const spotify = new Spotify(keys.spotify);
const userInput = process.argv.slice(3).join(" ")
const spotifySong = userInput => {

    spotify
    .search({ type: 'track', query:userInput})
    .then(function(response) {

      console.log(JSON.stringify(response.tracks.items[0].artists,null,2));
    })
    .catch(function(err) {
      console.log(err);
    });
}

// response.tracks.items[0-19].{artists[0].name  name}          
switch (process.argv[2]) {
    case "concert-this":
        
        break;
    case "spotify-this-song":
        spotifySong(userInput)
        break;
    case "movie-this":
        
        break;
    case "do-what-it-says":
        
        break;

    default:
        break;
}

