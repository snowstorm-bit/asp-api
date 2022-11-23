'use strict';
const { DataTypes } = require('sequelize');
const Place = require('../classes/place');

const { throwError } = require('../utils/utils');
const validation = require('../utils/validation');
const error = require('../json/errors.json');

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
                validate: {
                    isValid(value) {
                        if (!validation.validateEmptyOrWhiteSpace(value)) {
                            throwError(error.fields.place.title.empty_or_white_spaces, 422);
                        } else if (!validation.validateRange(value, titleMinLength, titleMaxLength)) {
                            throwError(error.fields.place.title.length, 422);
                        }
                    }
                },
                set(value) {
                    if (typeof value !== 'string')
                        value = String(value);

                    value.trim();

                    this.setDataValue('username', value.toLowerCase());
                }
            },
            description: {
                type: DataTypes.STRING(descriptionMaxLength),
                allowNull: false,
                unique: true,
                validate: {
                    isValid(value) {
                        if (!validation.validateEmptyOrWhiteSpace(value)) {
                            throwError(error.fields.place.title.empty_or_white_spaces, 422);
                        } else if (!validation.validateRange(value, descriptionMinLength, descriptionMaxLength)) {
                            throwError(error.fields.place.description.length, 422);
                        }
                    }
                }
            },
            steps: {
                type: DataTypes.STRING(stepsMaxLength),
                allowNull: false,
                validate: {
                    isValid(value) {
                        if (!validation.validateEmptyOrWhiteSpace(value)) {
                            throwError(error.fields.place.title.empty_or_white_spaces, 422);
                        } else if (!validation.validateRange(value, stepsMinLength, stepsMaxLength)) {
                            throwError(error.fields.place.steps.length, 422);
                        }
                    }
                }
            },
            latitude: {
                type: DataTypes.STRING(9),
                allowNull: false,
                field: 'access_level',
                validate: {
                    isValid(value) {}
                },
                get(){
                    
                }
            },
            longitude: {
                type: DataTypes.STRING(10),
                allowNull: false,
                field: 'access_level'
            },
            userId: {
                
            }
        },
        {
            sequelize,
            timestamps: true
        }
    );

    return Place;
};
