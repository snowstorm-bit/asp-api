'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
const Place = require('./classes/place');
const Climb = require('./classes/climb');


dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'find_your_way',
    process.env.DB_USER || 'root',
    null,
    {
        dialect: process.env.DIALECT || 'mariadb',
        host: 'localhost',
        port: 3307
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Users = require('./models/user')(db.sequelize);
db.Places = require('./models/place')(db.sequelize);
db.Climbs = require('./models/climb')(db.sequelize);
db.UserRates = require('./models/userRates')(db.sequelize);

db.PlaceAssociation = Place.hasMany(Climb, {
    foreignKey: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'place_id',
        name: 'placeId'
    }
});

db.ClimbAssociation = Climb.belongsTo(Place);

module.exports = db;
