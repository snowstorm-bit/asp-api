'use strict';

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

/** Vérifie si la requête a un token JWT valide */
module.exports.needsAuth = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        res.status(401).send({ error: 'Not authenticated' });
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.SECRET_JTW_KEY);
    } catch (err) {
        err.statusCode = 401;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }
    // Passe le token décodé dans la requête pour pouvoir l'utiliser ailleurs
    req.user = decodedToken;
    next();
};

/** Vérifie si la requête a un token JWT */
module.exports.isAuth = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            try {
                let decodedToken = jwt.verify(token, process.env.SECRET_JTW_KEY);
                if (decodedToken) {
                    req.user = decodedToken;
                }
                req.user = { status: 401 };
            } catch {
                req.user = { status: 401 };
            }
        }
    }
    next();
};
