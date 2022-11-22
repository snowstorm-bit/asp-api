"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const accountRoutes = require("./routes/accountRoutes");

const database = require("./database");
const { status } = require("./utils");
dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(accountRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Page introuvable !' });
});

// Manage error
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    message: error.message,
    status: status.error,
    data: error.data || {},
  });
});

try {
  
} catch (error) {
  
}

database.sequelize
  .sync()
  .then(() => {
    app.listen(8080, () => {
      console.log("Connection à la BD ouverte sur le port %s ", 8080);
      let dateNow = new Date(Date.now());
      dateNow = `${dateNow.getFullYear()}-${
        dateNow.getMonth() + 1
      }-${dateNow.getDate()} ${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`;
      console.log(dateNow);
    });
  })
  .catch((err) => console.log(err));
