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
                type: DataTypes.STRING(emailMaxLength),
                allowNull: false,
                validate: {
                    isValid(value) {
                        if (!validation.validateEmptyOrWhiteSpace(value)) {
                            throwError(error.field.username.empty_or_white_spaces);
                        } else if (!validation.validateRange(value, usernameMinLength, usernameMaxLength)) {
                            throwError(error.field.username.length);
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
                    isEmail: {
                        args: true,
                        msg: error.field.email.invalid
                    },
                    isValid(value) {
                        if (!validation.validateEmptyOrWhiteSpace(value)) {
                            throwError(error.field.email.empty_or_white_spaces);
                        } else if (!validation.validateMaxValue(value, emailMaxLength)) {
                            throwError(error.field.email.length_exceeded);
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
                        // A copy of the is necessary since, when validating if value if empty or white space, we trim it  
                        let valueToValidate = value;
                        if (!validation.validateEmptyOrWhiteSpace(valueToValidate)) {
                            throwError(error.field.password.empty_or_white_spaces);
                        } else if (!validation.validateRange(valueToValidate, passwordMinLength, passwordMaxLength)) {
                            throwError(error.field.password.length);
                        } else {
                            let errorToThrow = '';
                            if (value.match('[0-9]') === null) {
                                errorToThrow += error.field.password.no_number + ';';
                            }
                            if (value.match('[#?!@$%^&*-]') === null) {
                                errorToThrow += error.field.password.no_symbol + ';';
                            }
                            if (value.match('[A-Z]') === null) {
                                errorToThrow += error.field.password.no_uppercase_letter;
                            }

                            if (errorToThrow.length > 0) {
                                if (errorToThrow.indexOf(';') === errorToThrow.length - 1) {
                                    errorToThrow = errorToThrow.slice(0, -1);
                                }
                                throwError(errorToThrow);
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
                beforeCreate: record => this.password = hashPassword(record.password),
                beforeUpdate: record => this.password = hashPassword(record.password)
            }
        }
    );

    return User;
};
