import jwt from 'jsonwebtoken';

if (process.env.ACCESS_TOKEN_SECRET === undefined) {
  throw new Error('Environment variable ACCESS_TOKEN_SECRET must be set.');
}

export const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    req.userData = decoded;
    next();
  } catch (e) {
    return res.status(401).json({
      message: 'Auth failed',
    });
  }
};
