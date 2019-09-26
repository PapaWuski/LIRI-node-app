require("dotenv").config();
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
const Spotify = require("node-spotify-api");
const inquirer = require("inquirer");
const keys = require("./keys.js");

const spotify = new Spotify(keys.spotify);

const spotifySong = userInput => {
  spotify
    .search({ type: "track", query: userInput })
    .then(function(response) {
      console.log(JSON.stringify(response.tracks.items[0], null, 2));
      console.log(JSON.stringify(response.tracks.items[0].artists, null, 2));
console.log(
`
${response.tracks.items[0].external_urls.spotify}
${response.tracks.items[0].artists[0].name}
${response.tracks.items[0].name}
${response.tracks.items[0].album.name}
`
)
    })
    .catch(function(err) {
      console.log(err);
    });
};

const movieThis = userInput => {
  // have a default movie
  const url = `http://www.omdbapi.com/?t=${userInput}&y=&plot=short&apikey=${keys.axios.omdb}`;
  axios.get(url).then(response => {
console.log(`
${response.data.Title}
${response.data.Year}
${response.data.imdbRating}
${response.data.Country}
${response.data.Language}
${response.data.Plot}
${response.data.Actors}`)
    // * Title of the movie.
    // * Year the movie came out.
    // * IMDB Rating of the movie.
    // * Rotten Tomatoes Rating of the movie.
    // * Country where the movie was produced.
    // * Language of the movie.
    // * Plot of the movie.
    // * Actors in the movie.
  }).catch(err => console.log(err));
};

const concertThis = userInput => {
  
  const url = `https://rest.bandsintown.com/artists/${userInput}?app_id=${keys.axios.bit}`;
  axios.get(url).then(response => {
    console.log(response);
  }).catch(err => console.log(err));
};

// create logging function here
const appendToLog = str => {
  fs.writeFile  
}

// response.tracks.items[0-19].{artists[0].name  name}
inquirer
  .prompt([
    {
      name: "response",
      message: "What would you like LIRI to do today?",
      type: "list",
      choices: [
        "Concert This",
        "Spotify This",
        "Movie This",
        "Do what it says",
        "Quit"
      ]
    }
  ])
  .then(data => {
    switch (data.response) {
      case "Concert This":
          inquirer
            .prompt([
              {
                name: "bandName",
                type: "input",
                message: "What is the name of the band you are looking for?"
              }
            ])
            .then(data => {
              concertThis(data.bandName);
            });
        break;
      case "Spotify This":
        inquirer
          .prompt([
            {
              name: "songName",
              type: "input",
              message: "What is the name of the song you are looking for?"
            }
          ])
          .then(data => {
            spotifySong(data.songName);
          });
        break;
      case "Movie This":
        inquirer
          .prompt([
            {
              name: "movieName",
              type: "input",
              message: "What is the name of the movie you're looking for?"
            }
          ])
          .then(data => {
            movieThis(data.movieName);
          });
        break;
      case "Do what it says":
        break;
      default:
        break;
    }
  });
