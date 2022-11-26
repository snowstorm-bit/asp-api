const { Model } = require('sequelize');
var bcrypt = require('bcrypt');
const { hashPassword } = require('../utils/utils');

class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }
}

module.exports = User;
