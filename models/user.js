'use strict';
const { DataTypes } = require('sequelize');
const User = require('../classes/user');

const { throwError, hashPassword } = require('../utils/utils');
const validation = require('../utils/validation');
const errors = require('../json/errors.json');

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
                    is: {
                        args: /^[a-zA-Z -]+$/,
                        msg: errors.user.username.invalid
                    },
                    isValid(value) {
                        let val = String(value);
                        if (!validation.validateEmptyOrWhiteSpace(val)) {
                            throwError(errors.user.username.empty_or_white_spaces);
                        } else if (!validation.validateRange(value.length, usernameMinLength, usernameMaxLength)) {
                            throwError(errors.user.username.length);
                        }
                    }
                }
            },
            email: {
                type: DataTypes.STRING(emailMaxLength),
                allowNull: false,
                unique: true,
                validate: {
                    isValid(value) {
                        if (typeof value !== 'string')
                            value = String(value);
                        this.setDataValue('email', value.toLowerCase());

                        if (!validation.validateEmptyOrWhiteSpace(value)) {
                            throwError(errors.user.email.empty_or_white_spaces);
                        } else if (!validation.validateMaxValue(value.length, emailMaxLength)) {
                            throwError(errors.user.email.length_exceeded);
                        }
                    },
                    isEmail: {
                        args: true,
                        msg: errors.user.email.invalid
                    }
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
                            throwError(errors.user.password.empty_or_white_spaces);
                        } else if (!validation.validateRange(valueToValidate.length, passwordMinLength, passwordMaxLength)) {
                            throwError(errors.user.password.length);
                        } else {
                            let errorToThrow = '';
                            if (value.match('[0-9]') === null) {
                                errorToThrow += errors.user.password.no_number + ';';
                            }
                            if (value.match('[#?!@$%^&*-]') === null) {
                                errorToThrow += errors.user.password.no_symbol + ';';
                            }
                            if (value.match('[A-Z]') === null) {
                                errorToThrow += errors.user.password.no_uppercase_letter;
                            }

                            if (errorToThrow.length > 0) {
                                if (errorToThrow.indexOf(';') === errorToThrow.length - 1) {
                                    errorToThrow = errorToThrow.slice(0, -1);
                                }
                                throwError(errorToThrow);
                            }

                            value.trim();
                            this.setDataValue('password', hashPassword(value));
                        }
                    }
                }
            },
            accessLevel: {
                type: DataTypes.INTEGER(1),
                allowNull: false,
                field: 'access_level'
            }
        },
        {
            sequelize,
            timestamps: true
        }
    );

    return User;
};
