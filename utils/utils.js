'use strict';

const bcrypt = require('bcrypt');
const error = require('../json/errors.json');

module.exports.throwError = (error, cause = null, code = null, isModelError = true) => {
    let err = isModelError
        ? new Error(error)
        : { code: error };

    if (cause !== null) {
        err.cause = cause;
    }

    if (code !== null) {
        err.statusCode = code;
    }

    throw err;
};

let updateIfAllowNullErrorMessage = (message, validatorKey, cause) => {
    if (validatorKey === 'is_null') {
        return error.cause[cause].is_null;
    }
    return message;
};

module.exports.manageError = (err, globalError) => {
    let errorToManage = {
        codes: {}
    };

    // Manage errors return by sequelize validation
    if ('errors' in err) {
        errorToManage.statusCode = 422;
        err.errors.forEach(errToManage => {
            let cause = errToManage.path;

            // When validation has many error messages in the error message
            if (errToManage.message.includes(';')) {
                errorToManage.codes[cause] = [];
                let errorCodes = errToManage.message.split(';');

                errorCodes.forEach(errorCode =>
                    errorToManage.codes[cause].push(updateIfAllowNullErrorMessage(
                        errorCode,
                        errToManage.validatorKey,
                        cause)
                    ));
            } else {
                errorToManage.codes[cause] = updateIfAllowNullErrorMessage(
                    errToManage.message,
                    errToManage.validatorKey,
                    cause);
            }
        });
    } else if ('code' in err) { // manage custom error thrown
        errorToManage.codes[err.cause] = err.code;
        errorToManage.statusCode = err.statusCode;
    } else if (typeof err === 'string') {
        errorToManage.message = err;
    } else { // manage global thrown error
        errorToManage.codes[globalError.cause] = globalError.code;
    }

    errorToManage.statusCode = errorToManage.statusCode || 500;

    return errorToManage;
};

module.exports.toString = value => {
    if (typeof value !== 'string')
        value = String(value);

    value.trim();
};

module.exports.hashPassword = password =>
    bcrypt.hashSync(`${ password }`, 12);

module.exports.status = {
    success: 'success',
    error: 'error'
};

module.exports.userAccessLevel = {
    user: 1,
    admin: 2
};
