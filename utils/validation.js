'use strict';
const { toString } = require('../utils/utils');

exports.validateEmptyOrWhiteSpace = value => {
    toString(value);
    return value.length >= 1;
};

exports.validateMaxLength = (value, max) => {
    toString(value);
    return value.length <= max;
};

exports.validateLength = (value, min, max) => {
    toString(value);
    return value.length >= min && value.length <= max;
};

exports.errors = {};