'use strict';

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { throwError, manageError } = require('../utils/utils');
const errors = require('../json/errors.json');
const { userAccessLevel } = require('../utils/enums');
dotenv.config();

/** À utiliser lorsque nous avons uniquement besoin de savoir si l'utilisateur est connecté. */
module.exports.isAuth = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            try {
                let decodedToken = jwt.verify(token, process.env.SECRET_JTW_KEY);
                if (decodedToken) {
                    req.user = decodedToken;
                } else {
                    req.user = { status: 401 };
                }
            } catch {
                req.user = { status: 401 };
            }
        }
    }
    next();
};

function decodeToken(authHeader) {
    if (!authHeader) {
        throwError(errors.auth.login_required, 'authentication', 401, false);
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.SECRET_JTW_KEY);
    } catch (err) {
        let errCode = err.name === 'TokenExpiredError' ? errors.auth.session_expired : errors.auth.invalid;
        throwError(errCode, 'authentication', 401, false);
    }
    if (!decodedToken) {
        throwError(errors.auth.login_required, 'authentication', 401, false);
    }
    return decodedToken;
}

/** À utiliser lorsque l'utilisateur a besoin d'être connecté */
module.exports.needsAuth = (req, res, next) => {
    try {
        req.user = decodeToken(req.get('Authorization'));
        next();
    } catch (err) {
        throw manageError(err, {
            code: errors.auth.invalid,
            cause: 'authentication'
        });
    }
};

module.exports.needsUserAuth = (req, res, next) => {
    try {
        req.user = decodeToken(req.get('Authorization'));
        if (req.user.accessLevel !== userAccessLevel.user) {
            throwError(errors.auth.unauthorized, 'authentication', 403, false);
        }
        next();
    } catch (err) {
        throw manageError(err, {
            code: errors.auth.invalid,
            cause: 'authentication'
        });
    }
};

module.exports.needsAdminAuth = (req, res, next) => {
    try {
        req.user = decodeToken(req.get('Authorization'));
        if (req.user.accessLevel !== userAccessLevel.admin) {
            throwError(errors.auth.unauthorized, 'authentication', 403, false);
        }
        next();
    } catch (err) {
        throw manageError(err, {
            code: errors.auth.invalid,
            cause: 'authentication'
        });
    }
};