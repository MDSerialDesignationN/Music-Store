const { default: mongoose } = require("mongoose");

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
});

const Artist = mongoose.model("Artist", artistSchema);
module.exports = Artist;
