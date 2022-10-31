import { Router } from 'express';
import { userRouter } from './controller/user.controller';
import { adminArtists } from './controller/adminArtists.controller';
export const globalRouter = Router({ mergeParams: true });

globalRouter.get('/', (req, res) => {
  res.send({ message: `spotify-clone-backend is available` });
});


globalRouter.use('/user', userRouter);
globalRouter.use('/admin', adminArtists);



