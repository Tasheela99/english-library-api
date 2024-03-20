const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authorizedHeader = req.headers.authorization;
    if (!authorizedHeader) {
        return res.status(401).json({status: false, error: 'NO TOKEN PROVIDED'})
    }
    if (!authorizedHeader.startsWith('Bearer ')) {
        return res.status(401).json({status: false, error: 'INVALID TOKEN FORMAT'});
    }
    const token = authorizedHeader.slice(7);
    if (!token) {
        return res.status(401).json({status: false, error: 'INVALID TOKEN'});
    }
    try {
        const decodedData = jwt.verify(token, process.env.SECRET_KEY);
        next();
    } catch (error) {
        return res.status(404).json({status: false, error: 'INVALID TOKEN'});
    }
}


module.exports = verifyToken