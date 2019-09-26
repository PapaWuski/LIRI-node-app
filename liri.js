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
      if (!response.tracks.items) {
        const errMsg = "No songs found!";
        appendToLog(errMsg);
        console.log(errMsg);
        return;
      }
      const print = `
  Artist Name: ${response.tracks.items[0].artists[0].name}
  Track Name: ${response.tracks.items[0].name}
  Album Name: ${response.tracks.items[0].album.name}
  Link to Spotify: ${response.tracks.items[0].external_urls.spotify}
`;
      appendToLog(print);
      console.log(print);
    })
    .catch(function(err) {
      console.log(err);
    });
};

const movieThis = userInput => {
  // have a default movie
  const url = `http://www.omdbapi.com/?t=${userInput}&y=&plot=short&apikey=${keys.axios.omdb}`;
  axios
    .get(url)
    .then(response => {
      if (response.data.Error) {
        appendToLog(response.data.Error);
        console.log(response.data.Error);
        return;
      }
      const print = `
  Title: ${response.data.Title}
  Release Year: ${response.data.Year}
  IMDB Rating: ${response.data.imdbRating}
  Produced in: ${response.data.Country}
  Avaliable in: ${response.data.Language}
  Plot Summary: ${response.data.Plot}
  Major Actors: ${response.data.Actors}
`;
      appendToLog(print);
      console.log(print);
    })
    .catch(err => console.log(err));
};

const concertThis = userInput => {
  const url = `https://rest.bandsintown.com/artists/${userInput}/events?app_id=${keys.axios.bit}`;
  axios
    .get(url)
    .then(response => {
      // console.log(response)
      // console.log(response.data[0].datetime)
      let concertsCount = 5;
      if (response.data.length < 5) {
        concertsCount = response.data.length;
      }
      if (concertsCount === 0) {
        console.log(`There's no concerts for ${userInput}`);
        return;
      }
      let print = "";
      console.log(`Here are ${concertsCount} concerts for ${userInput}!`);
      for (let i = 0; i < concertsCount; i++) {
        print = `
  Venue: ${response.data[i].venue.name}
  Location: ${response.data[i].venue.city},${response.data[i].venue.country}
  Date: ${response.data[i].datetime}
`;
        appendToLog(print);
        console.log(print);
      }
    })
    .catch(err => console.log(err.response.data.errorMessage));
};

// create logging function here
const appendToLog = str => {
  fs.appendFile("log.txt", moment().format("lll") + ": " + str + "\n", function(
    err
  ) {
    if (err) {
      throw err;
    }
  });
};

const doWhatItSays = () =>{
  
}


// response.tracks.items[0-19].{artists[0].name  name}
const program = () => {
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
      appendToLog(data.response);
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
              appendToLog(data.bandName);
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
              appendToLog(data.songName);
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
              appendToLog(data.movieName);
              movieThis(data.movieName);
            });
          break;
        case "Do what it says":
          break;
        case "Quit":
          console.log("Okay Goodbye!");
          break;
        default:
          console.log("How did you get here? please send log file to dev.");
          break;
      }
    });
};

program();
