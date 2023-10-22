import jwt from 'jsonwebtoken';

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(401);    
}
