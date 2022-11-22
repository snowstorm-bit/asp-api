"use strict";

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "database_development",
  process.env.DB_USER || "root",
  null,
  {
    dialect: process.env.DIALECT || "mariadb",
    host: "localhost",
    port: 3307,
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
