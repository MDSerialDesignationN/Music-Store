const { default: mongoose } = require("mongoose");

const albumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  release_year: { type: Number, required: true },
  artist_id: { type: mongoose.Types.ObjectId, ref: "Artist", required: true },
  genre_id: { type: mongoose.Types.ObjectId, ref: "Genre", required: true },
  price: { type: Number, required: true, default: 9.99 },
});
const Album = mongoose.model("Album", albumSchema);
module.exports = Album;
