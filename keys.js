console.log("this is loaded");

exports.spotify = {
	id: process.env.SPOTIFY_ID,
	secret: process.env.SPOTIFY_SECRET
};

exports.axios = {
	omdb: process.env.MOVIEOMDB_APIKEY
}