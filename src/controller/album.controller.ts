import models from '../models';
import asyncHandler from 'express-async-handler';
import { auth } from '../middleware/auth';
import { Router } from 'express';
export const albums = Router({ mergeParams: true });

albums.get(
  '/',
  auth,
  asyncHandler(async (req, res) => {
    try {
      const orderByList: string[] = ['date', 'name', 'description'];
      let albums;
      for (const item of orderByList) {
        if (req.query.orderBy === item) {
          albums = await models.album.findAll({
            where: { userId: req.params.userId, artistId: req.params.artistId },
            order: [[req.query.orderBy, req.query.orderDir]],
            include: { model: models.song }
          });
        }
      }
      if (albums) {
        return res.status(200).send(albums);
      }
      for (const item of orderByList) {
        if (req.query.orderBy !== item) {
          res.status(500).send('orderBy is not exist');
        }
      }
    } catch (e) {
      res.status(500).send('cant get albums something went wrong');
    }
  })
);


albums.get(
  '/:albumId',
  auth,
  asyncHandler(async (req, res) => {
    try {
      const album = await models.album.findOne({
        where: { artistId: req.params.artistId, albumId: req.params.albumId },
        include: {
          model: models.song,
        },
      });
      if (!album) {
        return res.status(404).send('not found');
      }
      res.send(album);
    } catch (e) {
      res.status(500).send('cant get album something went wrong');
    }
  })
);

albums.post(
  '/',
  auth,
  asyncHandler(async (req, res) => {
    try {
      const data = req.body;
      const artistId = req.params.artistId;
      const userId = await req.params.userId;
      let album = await models.album.create({ ...data, artistId, userId });
      // check for songs to create
      if (data.songs && data.songs.length > 0) {
        for (const song of data.songs) {
          await models.song.create({ ...song, albumId: album.albumId, artistId, userId, songId: song.songId });
        }
      }
      album = await models.album.findOne({ where: { albumId: album.albumId }, include: { model: models.song } });
      res.status(201).send(album);
    } catch (e) {
      console.log(e, "error");
      res.status(400).send('cant post album something went wrong');
    }
  })
);

albums.delete(
  '/:albumId',
  auth,
  asyncHandler(async (req, res) => {
    try {
      const album = await models.album.findOne({ where: { albumId: req.params.albumId, userId: req.params.userId } });
      if (!album) {
        return res.status(404).send('albumId is not found');
      }
      album.destroy();
      res.send({ album });
    } catch (e) {
      res.status(500).send('cant delete album something went wrong');
    }
  })
);

albums.patch(
  '/:albumId',
  auth,
  asyncHandler(async (req, res) => {
    try {
      const data = req.body;
      const album = await models.album.findOne({
        where: { artistId: req.params.artistId, albumId: req.params.albumId, userId: req.params.userId },
        include: { model: models.song }
      });
      if (!album) {
        return res.status(404).send('album is not found');
      }
      await album.update({ ...data });
      if (data.songs && data.songs.length > 0) {
        for (const song of data.songs) {
          await models.song.update({ ...song }, {
            where: {
              artistId: req.params.artistId, songId: song.songId, albumId: req.params.albumId, userId: req.params.userId
            },
          });
          if (song.songId === undefined) {
            await models.song.create({ ...song, albumId: req.params.albumId, artistId: req.params.artistId, userId: req.params.userId, songId: song.songId });
          }
        }
      }
      const newAlbum = await models.album.findOne({
        where: { artistId: req.params.artistId, albumId: req.params.albumId, userId: req.params.userId },
        include: { model: models.song }
      });
      res.status(201).send(newAlbum);
    } catch (e) {
      res.status(400).send('cant update album something went wrong');
    }
  })
);

