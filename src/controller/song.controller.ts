import models from '../models';
import asyncHandler from 'express-async-handler';
import { auth } from '../middleware/auth';
import { Router } from 'express';
export const songs = Router({ mergeParams: true });

songs.get(
  '/',
  auth,
  asyncHandler(async (req, res) => {
    let songs;
    try {
      songs = await models.song.findAll({});
      res.send(songs);
    } catch (e) {
      res.status(500).send('cant get songs something went wrong');
    }
  })
);

songs.get(
  '/:songId',
  auth,
  asyncHandler(async (req, res) => {
    try {
      const song = await models.song.findOne({ where: { songId: req.params.songId, userId: req.params.userId } });
      if (!song) {
        return res.status(404).send('songId is not found');
      }
      res.send(song);
    } catch (e) {
      res.status(500).send('cant get song something went wrong');
    }
  })
);

songs.post(
  '/',
  auth,
  asyncHandler(async (req, res) => {
    try {
      const data = req.body;
      const userId = await req.params.userId;
      // validation …
      const songs = await models.song.create({ ...data, userId });
      res.status(201).send(songs);
    } catch (e) {
      res.status(400).send('cant post song something went wrong');
    }
  })
);

songs.delete(
  '/:songId',
  auth,
  asyncHandler(async (req, res) => {
    try {
      const song = await models.song.findOne({
        where:
        {
          userId: req.params.userId,
          artistId: req.params.artistId,
          albumId: req.params.albumId,
          songId: req.params.songId
        }
      });
      if (!song) {
        res.status(404).send('songId is not found');
      }
      await song.destroy();
      res.status(200).send(song);
    } catch (e) {
      res.status(500).send('cant delete song something went wrong');
    }
  })
);

songs.delete(
  '/favoriteSong/:songId',
  auth,
  asyncHandler(async (req, res) => {
    try {
      const song = await models.favoriteSong.findOne({
        where:
        {
          userId: req.params.userId,
          songId: req.params.songId
        }
      });
      if (!song) {
        res.status(404).send('songId is not found');
      }
      await song.destroy();
      res.status(200).send(song);
    } catch (e) {
      res.status(500).send('cant delete favorite song something went wrong');
    }
  })
);

songs.patch(
  '/:songId',
  auth,
  asyncHandler(async (req, res) => {
    try {
      const updatedData = req.body;
      // validation …
      const song = await models.song.findOne({
        where: { songId: req.params.songId },
      });
      if (!song) {
        return res.status(404).send('songId is not found');
      }
      const newSong = song.update({ ...updatedData });
      await models.favoriteSong.create({ songId: req.params.songId, userId: req.params.userId });
      res.status(200).send(newSong);
    } catch (e) {
      console.log(e);
      res.status(400).send('cant add this song to favorite list something went wrong');
    }
  })
);
