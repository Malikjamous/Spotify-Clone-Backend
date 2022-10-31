import models from '../models';
import asyncHandler from 'express-async-handler';
import { auth } from '../middleware/auth';
import { isAdmin } from '../middleware/auth-admin';
import { Router } from 'express';
export const adminSongs = Router({ mergeParams: true });

adminSongs.get(
    '/',
    auth,
    asyncHandler(async (req, res) => {
        let songs;
        try {
            songs = await models.song.findAll({ where: { userId: null } });
            res.send(songs);
        } catch (e) {
            res.status(500).send('cant get songs something went wrong');
        }
    })
);

adminSongs.get(
    '/:songId',
    auth,
    asyncHandler(async (req, res) => {
        try {
            const song = await models.song.findOne({ where: { songId: req.params.songId } });
            if (!song) {
                return res.status(404).send('songId is not found');
            }
            res.send(song);
        } catch (e) {
            res.status(500).send('cant get song something went wrong');
        }
    })
);

adminSongs.post(
    '/',
    auth,
    isAdmin,
    asyncHandler(async (req, res) => {
        try {
            const data = req.body;
            // validation …
            const songs = await models.song.create({ ...data });
            res.status(201).send(songs);
        } catch (e) {

            res.status(400).send('cant post songs something went wrong');
        }
    })
);

adminSongs.delete(
    '/:songId',
    auth,
    isAdmin,
    asyncHandler(async (req, res) => {
        try {
            const song = await models.song.findOne({
                where:
                {
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

adminSongs.patch(
    '/:songId',
    auth,
    isAdmin,
    asyncHandler(async (req, res) => {
        try {
            const updatedData = req.body;
            // validation …
            const song = await models.song.findOne({
                where: { artistId: req.params.artistId, albumId: req.params.albumId, songId: req.params.songId },
            });
            if (!song) {
                return res.status(404).send('songId is not found');
            }
            const newSong = song.update({ ...updatedData });
            res.status(200).send(newSong);
        } catch (e) {
            res.status(400).send('cant Update song something went wrong');
        }
    })
);
