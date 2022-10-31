import { Router } from 'express';
import models from '../models';
import asyncHandler from 'express-async-handler';
export const adminArtists = Router({ mergeParams: true });
import { auth } from '../middleware/auth';
import { isAdmin } from '../middleware/auth-admin';
import { adminAlbums } from './adminAlbums.controller';
import { adminSongs } from './adminSongs.controller';

adminArtists.use('/artists/:artistId/albums', adminAlbums);
adminArtists.use('/artists/:artistId/albums/:albumId/songs', adminSongs);

adminArtists.get('/artists', auth, asyncHandler(async (req, res) => {
    try {
        const artists = await models.artist.findAll({ where: { userId: null } });
        res.status(200).send(artists);
    } catch (error) {
        res.status(401).send('cant get artists something went wrong');
    }
}))

adminArtists.get(
    '/artists/:artistId',
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
            res.status(200).send(artist);
        } catch (e) {
            res.status(500).send('cant get artist something went wrong');
        }
    })
);

adminArtists.post('/artists', auth, isAdmin, asyncHandler(async (req, res) => {
    try {
        const data = req.body;
        const artist = await models.artist.create({ ...data });
        res.status(201).send(artist);
    } catch (error) {
        res.status(400).send('cant post artist something went wrong');
    }
}))

adminArtists.patch('/artists/:artistId', auth, isAdmin, asyncHandler(async (req, res) => {
    try {
        const UpdatedData = req.body;
        const artist = await models.artist.findOne({
            where: { artistId: req.params.artistId },
            include: { model: models.album }
        });

        if (!artist) {
            return res.status(404).send('artistId is not found');
        }
        const newArtist = artist.update({ ...UpdatedData });
        res.status(200).send(newArtist);
    } catch (e) {
        res.status(400).send('cant update artist something went wrong');
    }
}))

adminArtists.delete('/artists/:artistId', auth, isAdmin, asyncHandler(async (req, res) => {
    try {
        const artist = await models.artist.findOne({ where: { artistId: req.params.artistId } });
        if (!artist) {
            return res.status(404).send('artistId is not found');
        }
        await artist.destroy();
        res.send({ artist });
    } catch (e) {
        res.status(500).send('cant delete artist something went wrong');
    }
}))
