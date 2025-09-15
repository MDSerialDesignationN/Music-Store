const { Album } = require("../album");
const { Track } = require("../track");
const Artist = require("./artist.model");

class ArtistController {

    static async getAllArtists(req, res) {
        try {
            const artists = await Artist.find({});

            if (!artists || artists.length === 0) {
                return res.status(404).json({ error: "No artists available." });
            }

            res.json({
                message: "Artists retrieved successfully",
                artists: artists,
            });
        } catch (error) {
            console.error("Error retrieving artists:", error);
            res.status(500).json({
                error: "Internal Server Error while retrieving artists",
                details: error.message,
            });
        }
    }

    static async getArtistById(req, res) {
        const { id } = req.params;

        try {
            const artist = await Artist.findById(id);
            if (!artist) {
                return res.status(404).json({ error: "Artist not found" });
            }

            // Get all albums by this artist that have tracks
            const albums = await Album.find({ artist_id: id }).populate(
                "genre_id",
                "name"
            );

            // Filter albums that have tracks
            const albumsWithTracks = [];
            for (const album of albums) {
                const trackCount = await Track.countDocuments({ album_id: album._id });
                if (trackCount > 0) {
                    albumsWithTracks.push({
                        _id: album._id,
                        title: album.title,
                        release_year: album.release_year,
                        genre: album.genre_id,
                        trackCount: trackCount,
                    });
                }
            }

            res.json({
                message: "Artist retrieved successfully",
                artist: {
                    _id: artist._id,
                    name: artist.name,
                    country: artist.country,
                    albumCount: albumsWithTracks.length,
                    albums: albumsWithTracks,
                },
            });
        } catch (error) {
            console.error("Error retrieving artist:", error);
            res.status(500).json({
                error: "Internal Server Error while retrieving artist",
                details: error.message,
            });
        }
    }
}

module.exports = ArtistController;
