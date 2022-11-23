'use strict';

var bcrypt = require('bcrypt');

module.exports.throwError = (error, code) => {
    const err = new Error(error);
    err.statusCode = code;
    throw err;
};

module.exports.manageError = (next, err) => {
    let error = {};

    if (typeof err === 'string') {
        error.message = err;
    }

    if ('message' in err) {
        error.message = err.message;
    }

    error.statusCode = err.statusCode || 500;

    next(error);
};

module.exports.toString = value => {
    if (typeof value !== 'string')
        value = String(value);

    value.trim();
};

module.exports.hashPassword = password => bcrypt.hashSync(`${ password }`, 12);


module.exports.status = {
    success: 'success',
    error: 'error'
};
