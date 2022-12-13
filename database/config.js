'use strict';

const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const Place = require('../classes/place');
const Climb = require('../classes/climb');
const User = require('../classes/user');
const UserRatesModel = require('../classes/userRates');
const { createAdminUser } = require('./initialize');

let sequelize;

async function createSequelizeEntryPoint(databaseExisted) {
    console.log('Creating sequelize entry point');

    sequelize = new Sequelize(config.database, config.username, config.password, config.options);

    let Users = require('../models/user')(sequelize);
    let Places = require('../models/place')(sequelize);
    let Climbs = require('../models/climb')(sequelize);
    let UserRates = require('../models/userRates')(sequelize);

    // Defining place climbs relation
    Place.hasMany(Climb, {
        foreignKey: {
            name: 'placeId',
            field: 'place_id',
            allowNull: false
        }
    });

    Climb.belongsTo(Place, {
        foreignKey: {
            name: 'placeId',
            field: 'place_id'
        }
    });

    // Defining user climbs relation
    User.hasMany(Climb, {
        foreignKey: {
            name: 'userId',
            field: 'user_id',
            allowNull: false
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    Climb.belongsTo(User, {
        foreignKey: {
            name: 'userId',
            field: 'user_id'
        }
    });

    // Defining user rates relation
    User.hasMany(UserRatesModel, {
        foreignKey: {
            name: 'userId',
            field: 'user_id',
            allowNull: false
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    UserRatesModel.belongsTo(User, {
        foreignKey: {
            name: 'userId',
            field: 'user_id'
        }
    });

    Climb.hasOne(UserRatesModel, {
        foreignKey: {
            name: 'climbId',
            field: 'climb_id',
            allowNull: false
        }
    });

    UserRatesModel.belongsTo(Climb, {
        foreignKey: {
            name: 'climbId',
            field: 'climb_id'
        }
    });

    await sequelize.sync({});

    if (!databaseExisted) {
        await createAdminUser();
    }
}

module.exports.createSequelizeEntryPoint = createSequelizeEntryPoint;
module.exports.getSequelize = () => sequelize;

