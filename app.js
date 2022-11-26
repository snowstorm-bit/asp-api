'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const placeRoutes = require('./routes/placeRoutes');

const database = require('./database');
const { status } = require('./utils/utils');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/user', userRoutes);
app.use('/place', placeRoutes);
app.use((req, res, next) =>
    res.status(404).json({ message: 'Route introuvable !' }));

// Manage error
app.use((error, req, res, next) =>
    res.status(error.statusCode || 500).json({
        codes: error.codes,
        status: status.error
    }));

app.listen(8080, async () => {
    console.log('Connection à la BD ouverte sur le port %s ', 8080);

    await database.sequelize.sync();
});