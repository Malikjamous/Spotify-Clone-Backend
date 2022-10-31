export const isAdmin = (req, res, next) => {
    if (req.userData.userRole === 'admin') {
        next();
    } else {
        return res.status(403).json({
            message: 'you are not allowed to make changes',
        });
    }
};