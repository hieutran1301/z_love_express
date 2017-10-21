var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article');

var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var bcrypt = require('bcrypt');

module.exports = function (app, passport) {
  app.use('/auth', isLoggedIn, router);
};

router.get('/login', function(req, res, next){
	res.render('admin/pages/login', {
		title: 'Zlove Admin | Login',
		message: req.flash('loginMessage')
	});
});

router.post('/login', passport.authenticate('local-login', {
	successRedirect: '/admin/',
	failureRedirect: '/auth/login',
	failureFlash : true
}));

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/auth/login');
});

function isLoggedIn(req, res, next){
	if (req.isAuthenticated()) {
		res.redirect('/admin/');
	}
	else{
		return next();
	}
}