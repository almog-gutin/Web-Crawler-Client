const path = require('path');
const express = require('express');
const cors = require('cors');
const hbs = require('hbs');
const generalRouter = require('./routers/generalRouter');
const checkUrlRouter = require('./routers/checkUrlRouter');

const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, './templates/views');
const partailsPath = path.join(__dirname, './templates/partials');

const app = express();

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partailsPath);

app.use(express.json());
app.use(cors());
app.use(express.static(publicDirectoryPath));
app.use(generalRouter);
app.use(checkUrlRouter);

module.exports = app;
