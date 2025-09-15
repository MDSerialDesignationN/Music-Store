const express = require("express");
const AlbumController = require("./album.controller");

const albumRouter = express.Router();

albumRouter.get("/", AlbumController.getAllAlbums);
albumRouter.get("/:id", AlbumController.getAlbumById);

module.exports = albumRouter;
