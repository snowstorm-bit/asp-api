'use strict';

exports.validateEmptyOrWhiteSpace = value => {
    if (typeof value === 'string') {
        value.trim();
        return value.length >= 1;
    }
    return true;
};

exports.validateMaxValue = (value, max) => value <= max;

exports.validateRange = (value, min, max) => value >= min && value <= max;
