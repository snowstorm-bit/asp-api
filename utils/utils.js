'use strict';

const bcrypt = require('bcrypt');
const errors = require('../json/errors.json');

module.exports.throwError = (code, cause = null, statusCode = null, isModelValidationError = true) => {
    let err = isModelValidationError
        ? new Error(code)
        : { code: code };

    if (cause !== null) {
        err.cause = cause;
    }

    if (statusCode !== null) {
        err.statusCode = statusCode;
    }

    throw err;
};

let updateErrorIfNecessary = (model, errorCode, validatorKey, cause) => {
    if (validatorKey === 'is_null') {
        return errors[model][cause].is_null;
    } else if (validatorKey === 'not_unique') {
        return errors[model].unique_constraint;
    }
    return errorCode;
};

module.exports.manageError = (err, globalError) => {
    let errorToManage = {
        codes: {}
    };

    // console.log(err);

    // Manage errors return by sequelize validation
    if ('errors' in err) {
        errorToManage.statusCode = 422;
        err.errors.forEach(errToManage => {
            // console.log(errToManage);

            let cause = errToManage.path;
            let model = errToManage.instance.constructor.name.toString().toLowerCase();

            // When validation has many error messages in the error message
            if (errToManage.message.includes(';')) {
                errorToManage.codes[cause] = [];
                let errorCodes = errToManage.message.split(';');

                errorCodes.forEach(errorCode =>
                    errorToManage.codes[cause].push(updateErrorIfNecessary(
                        model,
                        errorCode,
                        errToManage.validatorKey,
                        cause))
                );
            } else {
                let error = updateErrorIfNecessary(
                    model,
                    errToManage.message,
                    errToManage.validatorKey,
                    cause);

                if (typeof error === 'string') {
                    errorToManage.codes[cause] = error;
                } else {
                    errorToManage.codes[error.cause] = error.code;
                }
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
