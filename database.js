'use strict';

const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const Place = require('./classes/place');
const Climb = require('./classes/climb');
const User = require('./classes/user');


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

db.PlaceHasManyClimbAssociation = Place.hasMany(Climb, {
    foreignKey: 'place_id'
});

db.ClimbBelongsToPlaceAssociation = Climb.belongsTo(Place, {
    foreignKey: 'place_id'
});

db.UserHasManyClimbAssociation = User.hasMany(Climb, {
    foreignKey: 'user_id'
});

db.ClimbBelongsToUserAssociation = Climb.belongsTo(User, {
    foreignKey: 'user_id'
});

module.exports = db;
