const jwt = require('jsonwebtoken');
const { unauthorizedResponse } = require('../api/utils/responseUtils');
require('dotenv').config();

module.exports = {
    verifyToken: async function (req, res, next) {
        const token = req.header("access-token");
        if (token == null) {
            res.status(401).json(
                unauthorizedResponse("Token not found at header")
            );
        } else {
            try {
                const verifyToken = await jwt.verify(token, process.env.SECRET_JWT);
                next();
            } catch (e) {
                res.status(401).json(unauthorizedResponse(e.toString()));
            }
        }
    }
}