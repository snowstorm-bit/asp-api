'use strict';

const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config/config.json')[env];

const Place = require('./classes/place');
const Climb = require('./classes/climb');
const User = require('./classes/user');
const UserRates = require('./classes/userRates');

let sequelize = new Sequelize(config.database, config.username, config.password, config.options);

const db = {};

db.Users = require('./models/user')(sequelize);
db.Places = require('./models/place')(sequelize);
db.Climbs = require('./models/climb')(sequelize);
db.UserRates = require('./models/userRates')(sequelize);

// Defining place climbs relation
db.PlaceHasManyClimbAssociation = Place.hasMany(Climb, {
    foreignKey: {
        name: 'placeId',
        field: 'place_id',
        underscored: true,
        allowNull: false
    }
});

db.ClimbBelongsToPlaceAssociation = Climb.belongsTo(Place, {
    foreignKey: 'place_id'
});


// Defining user climbs relation
db.UserHasManyClimbAssociation = User.hasMany(Climb, {
    foreignKey: {
        name: 'userId',
        field: 'user_id',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

db.ClimbBelongsToUserAssociation = Climb.belongsTo(User, {
    foreignKey: 'user_id'
});

// Defining user rates relation
User.hasMany(UserRates, {
    foreignKey: {
        name: 'user_id',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

UserRates.belongsTo(User, {
    foreignKey: 'user_id'
});

Climb.hasOne(UserRates, {
    foreignKey: {
        name: 'climb_id',
        allowNull: false
    }
});

UserRates.belongsTo(Climb, {
    foreignKey: 'climb_id'
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;