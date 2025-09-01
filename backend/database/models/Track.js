const { default: mongoose } = require("mongoose");

const trackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration_seconds: { type: Number, required: true },
  album_id: { type: mongoose.Types.ObjectId, ref: "Album", required: true },
});
const Track = mongoose.model("Track", trackSchema);
module.exports = Track;
