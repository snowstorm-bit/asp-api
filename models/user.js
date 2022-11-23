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

const userInvalidStatusCode = 422;

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
                            throwError(error.field.username.empty_or_white_spaces, userInvalidStatusCode);
                        } else if (!validation.validateLength(value, usernameMinLength, usernameMaxLength)) {
                            throwError(error.field.username.length, userInvalidStatusCode);
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
                            throwError(error.field.email.empty_or_white_spaces, userInvalidStatusCode);
                        } else if (!validation.validateMaxLength(value, emailMaxLength)) {
                            throwError(error.field.email.length_exceeded, userInvalidStatusCode);
                        } else {
                            if (!value.match("\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*")) {
                                throwError(error.field.email.invalid, userInvalidStatusCode);
                            }
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
                            throwError(error.field.password.empty_or_white_spaces, userInvalidStatusCode);
                        } else if (!validation.validateLength(value, passwordMinLength, passwordMaxLength)) {
                            throwError(error.field.password.length, userInvalidStatusCode);
                            throw new Error(error.field.password.length);
                        } else {
                            if (value.match('[0-9]') === null) {
                                throwError(error.field.password.no_number, userInvalidStatusCode);
                            }

                            if (value.match('[#?!@$%^&*-]') === null) {
                                throwError(error.field.password.no_symbol, userInvalidStatusCode);
                            }

                            if (value.match('[A-Z]') === null) {
                                throwError(error.field.password.no_uppercase_letter, userInvalidStatusCode);
                            }
                        }
                    }
                }
            },
            accessLevel: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'access_level'
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
