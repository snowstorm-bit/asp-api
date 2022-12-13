'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const placeRoutes = require('./routes/placeRoutes');
const climbRoutes = require('./routes/climbRoutes');

const path = require('path');

const { status } = require('./utils/enums');
const { uploadFiles } = require('./utils/utils');
const { needsAuth } = require('./middlewares/is-auth');
const { createDatabaseIfNotExists } = require('./database/initialize');
const { createSequelizeEntryPoint } = require('./database/config');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: Number.MAX_SAFE_INTEGER }));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: Number.MAX_SAFE_INTEGER }));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.post('/upload', needsAuth, (req, res, next) => {
    try {
        if (req.body.file !== undefined && req.body.file !== null) {
            uploadFiles(req.body.file);
        }
        res.status(200).json({
            status: status.success
        });
    } catch (e) {
        res.status(500).json({
            status: status.error
        });
    }
});

app.use('/user', userRoutes);
app.use('/place', placeRoutes);
app.use('/climb', climbRoutes);
app.use((req, res, next) =>
    res.status(404).json({ message: 'Route introuvable !' }));

// Manage error
app.use((error, req, res, next) => {
    console.log(error);
    res.status(error.statusCode || 500).json({
        codes: error.codes,
        status: status.error
    });
});

app.listen(8080, async () => {
    console.log('App started. Listening on port 8080');
    await createSequelizeEntryPoint(await createDatabaseIfNotExists());
});

