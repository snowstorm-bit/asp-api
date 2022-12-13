'use strict';

const dotenv = require('dotenv');
dotenv.config();
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const mariadb = require('mariadb');
const { hashPassword } = require('../utils/utils');

let pool;

let connection;

let databaseExisted = true;

async function createDatabaseIfNotExists() {
    try {
        pool = mariadb.createPool({
            host: config.options.host,
            port: config.options.port,
            user: config.username,
            password: config.password
        });
        connection = await pool.getConnection();
        let row = await connection.query(`SHOW DATABASES LIKE '${ config.database }'`);
        databaseExisted = row[0] !== undefined;
        if (!databaseExisted) {
            let createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${ config.database } DEFAULT CHARACTER SET latin1 COLLATE latin1_general_ci`;
            await connection.query(createDatabaseQuery);
            console.log('Database created if not exists');
        }
        return databaseExisted;
    } catch (err) {
        console.log('An error occured while creating database if not exists', err);
    } finally {
        if (connection) {
            connection.end(err => {
                if (err) {
                    console.log('An error occured while closing the connection', err);
                } else {
                    console.log('Connection to database closed');
                }
            });
        }
    }
}

async function createAdminUser() {
    try {
        pool = mariadb.createPool({
            host: config.options.host,
            port: config.options.port,
            database: config.database,
            user: config.username,
            password: config.password
        });

        connection = await pool.getConnection();

        let insertStatement = 'INSERT INTO `users` (`id`, `username`, `email`, `password`, `access_level`, `createdAt`, `updatedAt`) VALUES';
        let insertValues = `(1, 'admin', 'admin@asp.ca', '${ hashPassword('G@rn3@u!') }', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`;

        let createAdminQuery = `${ insertStatement } ${ insertValues }`;
        await connection.query(createAdminQuery);

        console.log('Admin user created');
    } catch (err) {
        console.log('An error occured while creating the admin user', err);
    } finally {
        if (connection) {
            connection.end(err => {
                if (err) {
                    console.log('An error occured while creating the admin user', err);
                } else {
                    console.log('Connection to database closed');
                }
            });
        }
    }
}

async function importData() {

}

module.exports.createDatabaseIfNotExists = createDatabaseIfNotExists;
module.exports.createAdminUser = createAdminUser;