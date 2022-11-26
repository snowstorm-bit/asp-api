'use strict';
const { DataTypes } = require('sequelize');
const Place = require('../classes/place');
const User = require('../classes/user');

const { throwError, hashPassword } = require('../utils/utils');
const validation = require('../utils/validation');
const errors = require('../json/errors.json');

const titleMinLength = 3;
const titleMaxLength = 50;
const descriptionMinLength = 3;
const descriptionMaxLength = 500;
const stepsMinLength = 3;
const stepsMaxLength = 500;
const latitudeMin = -90;
const latitudeMax = 90;
const longitudeMin = -180;
const longitudeMax = 180;

module.exports = sequelize => {
    Place.init(
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
                        msg: errors.place.title.length
                    },
                    isValid(value) {
                        if (!validation.validateEmptyOrWhiteSpace(value)) {
                            throwError(errors.place.title.empty_or_white_spaces);
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
                        msg: errors.place.description.length
                    },
                    isValid(value) {
                        if (!validation.validateEmptyOrWhiteSpace(value)) {
                            throwError(errors.place.title.empty_or_white_spaces);
                        }
                    }
                }
            },
            steps: {
                type: DataTypes.STRING(stepsMaxLength),
                allowNull: false,
                validate: {
                    len: {
                        args: [stepsMinLength, stepsMaxLength],
                        msg: errors.place.steps.length
                    },
                    isValid(value) {
                        if (!validation.validateEmptyOrWhiteSpace(value)) {
                            throwError(errors.place.title.empty_or_white_spaces);
                        }
                    }
                }
            },
            latitude: {
                type: DataTypes.FLOAT(),
                allowNull: false,
                validate: {
                    isValid(value) {
                        if (!validation.validateRange(value, latitudeMin, latitudeMax)) {
                            throwError(errors.place.latitude.range);
                        }
                    }
                }
            },
            longitude: {
                type: DataTypes.FLOAT(),
                allowNull: false,
                validate: {
                    isValid(value) {
                        if (!validation.validateRange(value, longitudeMin, longitudeMax)) {
                            throwError(errors.place.longitude.range);
                        }
                    }
                }
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'user_id',
                references: {
                    model: User,
                    key: 'id',
                    as: 'user_id'
                },
                onDelete: 'CASCADE'
            }
        },
        {
            sequelize,
            timestamps: true
        }
    );

    return Place;
};
