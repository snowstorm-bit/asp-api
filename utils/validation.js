'use strict';
const { toString } = require('../utils/utils');

exports.validateEmptyOrWhiteSpace = value => {
    toString(value);
    return value.length >= 1;
};

exports.validateMaxValue = (value, max) => {
    toString(value);
    return value <= max;
};

exports.validateRange = (value, min, max) => {
    toString(value);
    return value >= min && value <= max;
};

exports.errors = {};