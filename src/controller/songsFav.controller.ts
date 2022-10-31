import models from '../models';
import asyncHandler from 'express-async-handler';
import { auth } from '../middleware/auth';
import { Router } from 'express';
export const favSongs = Router({ mergeParams: true });

favSongs.get(
  '/',
  auth,
  asyncHandler(async (req, res) => {
    try {
      const favSongsIds = await models.favoriteSong.findAll({
        where: { userId: req.params.userId },
      });
      let favSongsArr: any = [];
      for (const favSong of favSongsIds) {
        const song = await models.song.findOne({
          where: { songId: favSong.songId },
        });
        favSongsArr.push(song);
      }
      res.status(200).send(favSongsArr);
    } catch (e) {
      res.status(500).send(e);
    }
  })
);
