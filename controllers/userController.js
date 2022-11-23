'use strict';

const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { manageError, status } = require('../utils/utils');
const { Users } = require('../database');
const error = require('../json/errors.json');

dotenv.config();

exports.register = async (req, res, next) => {
    try {
        let result = await Users.findOne({
            attributes: ['username', 'password'],
            where: {
                email: req.body.email,
                access_level: 1
            }
        });

        if (result !== null) {
            const err = new Error(error.field.email.already_taken);
            err.statusCode = 422;
            throw err;
        }

        let user = await Users.create(
            {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                accessLevel: 1
            }
        );

        user.save();

        res.status(201).json({
            message: 'success.registration',
            status: status.success,
            token: jwt.sign(
                {
                    username: req.body.username,
                    access_level: 1
                },
                process.env.SECRET_JTW_KEY,
                {
                    expiresIn: '1h'
                }
            )
        });
    } catch (err) {
        if (typeof err !== 'string' && !('message' in err))
            err.message = error.registration;
        manageError(next, err);
    }
};

exports.login = async (req, res, next) => {
    try {
        let result = await Users.findOne({
            attributes: ['username', 'password'],
            where: {
                username: req.body.username,
                access_level: 1
            }
        });

        if (result === null) {
            const err = new Error(error.field.email.not_found);
            err.statusCode = 422;
            throw err;
        }

        if (!bcrypt.compareSync(`${ req.body.password }`, result.password)) {
            const err = new Error(error.field.password.invalid);
            err.statusCode = 422;
        }

        res.status(200).json({
            message: 'success.login',
            status: status.success,
            token: jwt.sign(
                {
                    username: req.body.username,
                    access_level: 1
                },
                process.env.SECRET_JTW_KEY,
                {
                    expiresIn: '1h'
                }
            )
        });
    } catch (err) {
        if (typeof err !== 'string' && !('message' in err))
            err.message = error.login;
        manageError(next, err);
    }
};
