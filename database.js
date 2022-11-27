'use strict';

const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const PlaceClimbs = require('./classes/placeClimbs');
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
db.PlaceClimbs = require('./models/placeClimbs')(db.sequelize);
db.UserRates = require('./models/userRates')(db.sequelize);

db.PlaceHasMany = Place.hasMany(PlaceClimbs, {
    foreignKey: {
        allowNull: false
    }
});

db.PlaceClimbBelongsToPlace = PlaceClimbs.belongsTo(Place, {
    as: 'place'
});

db.ClimbHasOne = Climb.hasOne(PlaceClimbs, {
    foreignKey: {
        allowNull: false
    }
});

db.PlaceClimbsBelongsToClimb = PlaceClimbs.belongsTo(Climb, {
    as: 'climb'
});

module.exports = db;