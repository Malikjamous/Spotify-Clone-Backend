import { Router } from 'express';
import models from '../models';
import asyncHandler from 'express-async-handler';
export const userRouter = Router({ mergeParams: true });
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { artists } from './artist.controller';
import { albums } from './album.controller';
import { songs } from './song.controller';
import { favSongs } from './songsFav.controller';
if (process.env.ACCESS_TOKEN_SECRET === undefined) {
  throw new Error('Environment variable ACCESS_TOKEN_SECRET must be set.');
}

userRouter.use('/:userId/artists', artists);
userRouter.use('/:userId/artists/:artistId/albums', albums);
userRouter.use('/:userId/artists/:artistId/albums/:albumId/songs', songs);
userRouter.use('/:userId/favSongs', favSongs);

userRouter.post(
  '/signup',
  asyncHandler(async (req, res, next) => {
    try {
      const user = await models.user.findOne({
        where: { email: req.body.email },
      });
      if (user) {
        return res.status(409).json({
          message: 'Mail exists',
        });
      } else {
        await bcrypt.hash(req.body.password, 10, async (err, hash) => {
          if (req.body.password.length < 8) {
            return res.status(500).json({
              message: 'password muss be 8 length at least',
            });
          } else {
            if (err) {
              return res.status(500).json({
                error: err,
              });
            } else {
              const user = await models.user.create({
                email: req.body.email,
                password: hash,
                userRole: "user",
              });
              res.status(201).send(user);
            }
          }
        });
      }
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    }
  })
);

userRouter.post(
  '/login',
  asyncHandler(async (req, res, next) => {
    try {
      const user = await models.user.findOne({
        where: { email: req.body.email },
      });
      if (!user) {
        return res.status(500).json({
          message: 'Auth failed user is not found',
        });
      } else {
        await bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: 'Auth failed',
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user.email,
                userId: user.userId,
                userRole: user.userRole,
              },
              process.env.ACCESS_TOKEN_SECRET!,
              {
                expiresIn: '2h',
              }
            );
            return res.status(200).json({
              message: 'Auth Successful',
              user: user,
              token: token,
            });
          }
          res.status(401).json({
            message: 'Auth failed',
            error: err,
          });
        });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  })
);