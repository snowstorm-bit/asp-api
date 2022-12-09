'use strict';

const bcrypt = require('bcrypt');
const errors = require('../json/errors.json');
const fs = require('fs');

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

let toSnakeCase = value => {
    let snakeCaseValue = value[0].toLowerCase();

    for (let i = 1; i < value.length; i++) {
        let char = value[i];
        if (char.toUpperCase() === value[i]) {
            if (i < value.length - 1) {
                char = '_';
            }
            char += value[i].toLowerCase();
        }
        snakeCaseValue += char;
    }
    return snakeCaseValue;
};

let updateErrorIfNecessary = (model, errorCode, validatorKey, cause) => {
    if (validatorKey === 'is_null') {
        if (cause.match('[A-Z]')) {
            cause = toSnakeCase(cause);
        }
        console.log(model, cause, validatorKey, errorCode);
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
            let model = toSnakeCase(errToManage.instance.constructor.name.toString());

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

module.exports.hashPassword = password =>
    bcrypt.hashSync(`${ password }`, 12);

module.exports.uploadFiles = file => {
    let image = file.base64;
    const matches = image.match(/^data:([A-Za-z\+\/]+);base64,(.+)$/);
    let buff = Buffer.from(matches[2], 'base64');

    let path = `uploads/${ file.filename }`;

    fs.writeFileSync(path, buff);
};

module.exports.round = num =>
    (Math.round(Number((Math.abs(num) * 100).toPrecision(15))) / 100) * Math.sign(num);

module.exports.paginateResponse = (results, offset, limit, itemsCount) => ({
    offset: offset + results.length,
    items: results,
    hasMoreResult: results.length === limit
});