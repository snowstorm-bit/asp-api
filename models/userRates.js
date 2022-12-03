'use strict';
const { DataTypes } = require('sequelize');

const errors = require('../json/errors.json');
const validation = require('../utils/validation');
const { throwError } = require('../utils/utils');
const User = require('../classes/user');
const Climb = require('../classes/climb');
const UserRates = require('../classes/userRates');

const rateMin = 1;
const rateMax = 5;

module.exports = sequelize => {
    UserRates.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: User,
                    key: 'id',
                    as: 'user_id'
                },
                field: 'user_id'
            },
            climbId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: Climb,
                    key: 'id',
                    as: 'climb_id'
                },
                field: 'climb_id'
            },
            rate: {
                type: DataTypes.INTEGER(1),
                isInt: {
                    args: true,
                    msg: errors.user_rates.rate.not_int
                },
                allowNull: false,
                isValid(value) {
                    let valueToValidate = value;
                    if (!validation.validateEmptyOrWhiteSpace(valueToValidate)) {
                        throwError(errors.user_rates.rate.empty_or_white_spaces);
                    } else if (!validation.validateRange(value, rateMin, rateMax)) {
                        throwError(errors.user_rates.rate.range);
                    }
                }
            }
        },
        {
            sequelize,
            timestamps: false,
            underscored: true
        }
    );

    UserRates.removeAttribute('id');
    return UserRates;
};
