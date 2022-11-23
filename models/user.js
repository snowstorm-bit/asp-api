'use strict';
const { DataTypes } = require('sequelize');
const User = require('../classes/user');

const { throwError, hashPassword } = require('../utils/utils');
const validation = require('../utils/validation');
const error = require('../json/errors.json');

const usernameMinLength = 3;
const usernameMaxLength = 50;
const emailMaxLength = 50;
const passwordMinLength = 6;
const passwordMaxLength = 12;

module.exports = sequelize => {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            username: {
                type: DataTypes.STRING(usernameMaxLength),
                allowNull: false,
                validate: {
                    isValid(value) {
                        if (!validation.validateEmptyOrWhiteSpace(value)) {
                            throwError(error.fields.username.empty_or_white_spaces, 422);
                        } else if (!validation.validateRange(value.length, usernameMinLength, usernameMaxLength)) {
                            throwError(error.fields.username.length, 422);
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
            email: {
                type: DataTypes.STRING(emailMaxLength),
                allowNull: false,
                unique: true,
                validate: {
                    isValid(value) {
                        if (!validation.validateEmptyOrWhiteSpace(value)) {
                            throwError(error.fields.email.empty_or_white_spaces, 422);
                        } else if (!validation.validateMaxValue(value.length, emailMaxLength)) {
                        }
                    }
                },
                set(value) {
                    if (typeof value !== 'string')
                        value = String(value);

                    value.trim();

                    this.setDataValue('email', value.toLowerCase());
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isValid(value) {
                        if (!validation.validateEmptyOrWhiteSpace(value)) {
                            throw new Error(error.fields.username.empty_or_white_spaces);
                        } else if (!validation.validateRange(value.length, passwordMinLength, passwordMaxLength)) {
                            throw new Error(error.fields.password.length);
                        } else {
                            if (value.match('[0-9]') === null) {
                                throw new Error(error.fields.password.no_number);
                            }

                            if (value.match('[#?!@$%^&*-]') === null) {
                                throw new Error(error.fields.password.no_symbol);
                            }

                            if (value.match('[A-Z]') === null) {
                                throw new Error(error.fields.password.no_uppercase_letter);
                            }
                        }
                    }
                }
            },
            accessLevel: {
                type: DataTypes.INTEGER,
                allowNull: false,
                fields: 'access_level'
            }
        },
        {
            sequelize,
            timestamps: true,
            hooks: {
                beforeCreate: record => this.setDataValue('password', hashPassword(record.password)),
                beforeUpdate: record => this.setDataValue('password', hashPassword(record.password))
            }
        }
    );

    return User;
};
