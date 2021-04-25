const express = require('express');
const chalk = require('chalk');

const router = new express.Router();

router.get('/', (req, res) => res.render('index'));

router.get('/about', (req, res) => res.render('about'));

router.get('/tree', (req, res) => {
    const URL = req.query.url;
    if (!URL) return res.redirect('/');
    res.render('tree', {
        url: URL,
    });
});

module.exports = router;
