import models from '../models';
import asyncHandler from 'express-async-handler';
import { auth } from '../middleware/auth';
import { Router } from 'express';
export const artists = Router({ mergeParams: true });

artists.get(
  '/',
  auth,
  asyncHandler(async (req, res) => {
    try {
      const artists = await models.artist.findAll({
        where: { userId: req.params.userId },
        include: {
          model: models.album,
        },
      });
      res.send(artists);
    } catch (e) {
      res.status(500).send('cant get artists something went wrong');
    }
  })
);

artists.get(
  '/:artistId',
  auth,
  asyncHandler(async (req, res) => {
    try {
      const artist = await models.artist.findOne({
        where: { artistId: req.params.artistId },
        include: {
          model: models.album,
        },
      });
      if (!artist) {
        return res.status(404).send('artistId is not found');
      }
      res.send(artist);
    } catch (e) {
      res.status(500).send('cant get artist something went wrong');
    }
  })
);

artists.post(
  '/',
  auth,
  asyncHandler(async (req, res) => {
    try {
      const data = req.body;
      const userId = await req.params.userId;
      const artist = await models.artist.create({ ...data, userId });
      res.status(201).send(artist);
    } catch (e) {
      res.status(400).send('cant post artist something went wrong');
    }
  })
);

artists.delete(
  '/:artistId',
  auth,
  asyncHandler(async (req, res) => {
    try {
      const artist = await models.artist.findOne({ where: { artistId: req.params.artistId, userId: req.params.userId, } });
      if (!artist) {
        return res.status(404).send('artistId is not found');
      }
      await artist.destroy();
      res.send({ artist });
    } catch (e) {
      res.status(500).send('cant delete artist something went wrong');
    }
  })
);

artists.patch(
  '/:artistId',
  auth,
  asyncHandler(async (req, res) => {
    try {
      const UpdatedData = req.body;
      const artist = await models.artist.findOne({ where: { artistId: req.params.artistId, userId: req.params.userId } });

      if (!artist) {
        return res.status(404).send('artistId is not found');
      }
      const newArtist = artist.update({ ...UpdatedData });
      res.status(200).send(newArtist);
    } catch (e) {
      res.status(400).send('cant update artist something went wrong');
    }
  })
);
