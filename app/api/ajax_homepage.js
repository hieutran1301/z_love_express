var express = require('express'),
router = express.Router(),
mongoose = require('mongoose');

var user = mongoose.model('zlove_users');

module.exports = function (app, passport) {
    app.use('/ajax-home', router);
};