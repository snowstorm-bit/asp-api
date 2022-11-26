'use strict';
const { DataTypes } = require('sequelize');
const Climb = require('../classes/place');

const { throwError } = require('../utils/utils');
const validation = require('../utils/validation');
const errors = require('../json/errors.json');
const { climbStyle } = require('../utils/enums');

const titleMinLength = 3;
const titleMaxLength = 50;
const descriptionMinLength = 3;
const descriptionMaxLength = 500;
const rateMin = 1;
const rateMax = 5;

module.exports = sequelize => {
    Climb.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            title: {
                type: DataTypes.STRING(titleMaxLength),
                allowNull: false,
                unique: true,
                validate: {
                    len: {
                        args: [titleMinLength, titleMaxLength],
                        msg: errors.climb.title.length
                    },
                    isValid(value) {
                        if (!validation.validateEmptyOrWhiteSpace(value)) {
                            throwError(errors.climb.title.empty_or_white_spaces);
                        }
                    }
                }
            },
            description: {
                type: DataTypes.STRING(descriptionMaxLength),
                allowNull: false,
                validate: {
                    len: {
                        args: [descriptionMinLength, descriptionMaxLength],
                        msg: errors.climb.description.length
                    },
                    isValid(value) {
                        if (!validation.validateEmptyOrWhiteSpace(value)) {
                            throwError(errors.climb.description.empty_or_white_spaces);
                        }
                    }
                }
            },
            style: {
                type: DataTypes.STRING(),
                allowNull: false,
                isIn: {
                    args: [Object.keys(climbStyle)],
                    msg: errors.climb.style.not_in
                },
                validate: {
                    isValid(value) {
                        if (!validation.validateEmptyOrWhiteSpace(value)) {
                            throwError(errors.climb.style.empty_or_white_spaces);
                        }
                    }
                }
            },
            difficultyLevel: {
                type: DataTypes.NUMBER(1, 2),
                allowNull: false,
                validate: {
                    isDecimal: {
                        args: true,
                        msg: errors.climb.difficulty_level.not_decimal
                    },
                    isValid(value) {
                        let valueToValidate = value;
                        if (!validation.validateEmptyOrWhiteSpace(valueToValidate)) {
                            throwError(errors.climb.difficulty_level.empty_or_white_spaces);
                        }

                        let [integer, decimal] = valueToValidate.split('.');
                        integer = Number(integer);
                        decimal = Number(decimal);

                        if (integer < 5 || integer > 5 || decimal < 6 || decimal > 15) {
                            throwError(errors.climb.difficulty_level.range);
                        }
                    }
                },
                field: 'difficulty_level'
            },
            rate: {
                type: DataTypes.INTEGER(1),
                isInt: {
                    args: true,
                    msg: errors.climb.rate.not_int
                },
                isValid(value) {
                    let valueToValidate = value;
                    if (!validation.validateEmptyOrWhiteSpace(valueToValidate)) {
                        throwError(errors.climb.rate.empty_or_white_spaces);
                    } else if (!validation.validateRange(value, rateMin, rateMax)) {
                        throwError(errors.climb.rate.range);
                    }
                }
            },
            imgUrls: {
                type: DataTypes.TEXT(),
                allowNull: false,
                get(value) {
                    return value.split(';');
                },
                set(value) {
                    if (value !== undefined && value !== null) {
                        return value.join(';');
                    }
                },
                field: 'img_urls'
            }
        },
        {
            sequelize,
            timestamps: true
        }
    );

    return Climb;
};
