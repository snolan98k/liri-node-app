require("dotenv").config();
const fs = require('fs'); //file system
var keys = require("./keys.js");
const Spotify = require('node-spotify-api');
let request = require('request');
let axios = require('axios');
let moment = require('moment');

// let twitter = require('twitter');
// let request = require('request');
// var inquirer = require('inquirer');

var spotify = new Spotify(keys.spotify);
// const bands = new Bands(keys.bands)


function writeToLog(data) {
    fs.appendFile("log.txt", '\r\n\r\n', function (err) {
        if (err) {
            return console.log(err);
        }
    });

    fs.appendFile("log.txt", (data), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log(space + "log.txt was updated!");
    });
}

let space = "\n"
let header = "Sure. I'll share what I found: "
let cmd = process.argv[2];
let input = process.argv[3];
let param1 = process.argv[4];
let param2 = process.argv[5];

// console.log("command is: " + cmd);
// console.log("input is: " + input);
// console.log("param1 is: " + param1);
// console.log("param2 is: " + param2);

search = input;

if (!param1 && !param2) {
    console.log(space)
} else if (!param2) {
    search = (input + "+" + param1);
} else {
    search = (input + "+" + param1 + "+" + param2);
    console.log("the search string is: " + search)
};

//points to command functions
switch (cmd) {
    case "concert-this":
        concertThis(input);
        break;
    case "spotify-this-song":
        spotifyThisSong(search);
        break;
    case "movie-this":
        movieThis(input);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("Hey there, my commands are: ");
        console.log("Search band info   --     concert-this [artist]");
        console.log("Search song info   --     spotify-this-song [song]");
        console.log("Find move info     --     movie-this [movie]");
        console.log("See what happens   --     do-what-it-says");
};




// concert-this
function concertThis(search) {
    if (!search) {
        search = "Trevor Hall"
    }

    axios.get("https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp")
        .then(function (response) {
            var showDate = moment(response.data[0].datetime).format('MM/DD/YYYY');
            output = space + header +
                space + 'Artist: ' + search +
                space + 'Venue: ' + response.data[0].venue.name +
                space + 'Date: ' + showDate +
                // space + 'Date: ' + response.data[0].formatted_datetime +
                space + 'Location: ' + response.data[0].venue.city + " " + response.data[0].venue.region + " " + response.data[0].venue.country;
            console.log(output);
            writeToLog(output);
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
};



function spotifyThisSong(search) {
    if (!search) {
        search = "Dragonfly"
    }
    spotify.search({ type: 'track', query: search }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } else {
            output =
                "Ch-ch-check out this info: " +
                space + "Song Name: " + "'" + data.tracks.items[0].name + "'" +
                space + "Album Name: " + data.tracks.items[0].album.name +
                space + "Artist Name: " + data.tracks.items[0].album.artists[0].name +
                space + "URL: " + data.tracks.items[0].album.external_urls.spotify;
            console.log(output);
            writeToLog(output);
        }
    });
};


// movie-this
function movieThis(search) {
    if (!search) {
        search = "Cloud Atlas"
    }
    // `node liri.js movie-this '<movie name here>'`

    //    * This will output the following information to your terminal/bash window:
    // t = movietitle, y = year, plot is short, then the API key
    let urlHit = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=" + "879a15d0";

    request(urlHit, function (err, res, body) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } else {
            let jsonData = JSON.parse(body);
            output = space + header +
                space + 'Title: ' + jsonData.Title +
                space + 'Year: ' + jsonData.Year +
                space + 'Rated: ' + jsonData.Rated +
                space + 'IMDB Rating: ' + jsonData.imdbRating +
                space + 'Country: ' + jsonData.Country +
                space + 'Language: ' + jsonData.Language +
                space + 'Plot: ' + jsonData.Plot +
                space + 'Actors: ' + jsonData.Actors +
                space + 'Tomato Rating: ' + jsonData.Ratings[1].Value +
                space + 'IMDb Rating: ' + jsonData.imdbRating + "\n";

            console.log(output);
            writeToLog(output);
        }
    });

};


// do-what-it-says
function doWhatItSays() {
    whatdo = ""
    //  `node liri.js do-what-it-says`
    rando = Math.floor(Math.random() * 3);
    switch (rando) {
        case 0:
            // TODO: add readfile for different random commands. Log different for each search.
            fs.readFile("random.txt", "utf8", function (error, data) {
                whatdo = data;
                spotifyThisSong(whatdo);
                if (error) {
                    return console.log(error);
                }
            });
            break;
        case 1:
            whatdo = "John Legend"
            concertThis(whatdo);
            break;
        case 2:
            whatdo = "Saving+Private+Ryan"
            movieThis(whatdo);
            break;
    };
    //  * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
    //  * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
    //  * Edit the text in random.txt to test out the feature for movie-this and concert-this.
};