const ArtistController = require("./artist.controller");
const Artist = require("./artist.model");
const artistRouter = require("./artist.route");


module.exports = {
  Artist,
  ArtistController,
  artistRouter
};