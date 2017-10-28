var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');

module.exports = function (app, passport) {
  app.use('/admin', isLoggedIn, router);
};

router.get('/', function(req, res, next){
	res.redirect('/admin/dashboard');
});

router.get('/dashboard', function(req, res, next){
  res.render('admin/pages/dashboard', {
  		layout: 'admin/master',
    	title: 'Dashboard',
    	admin: req.session.adminuser
    });
});

router.get('/logout', function(req, res){
	delete req.session.authenticated;
	delete req.session.adminuser;
	res.redirect('/auth/login');
});

router.get('/users', function(req, res, next){
	res.render('admin/pages/users', {
		layout 		: 'admin/master',
		title		: 'Users manager',
		admin 		: req.session.adminuser
	});
});

function isLoggedIn(req, res, next){
	if (!req.session || !req.session.authenticated) {
		res.redirect('/auth/login');
	}
	else{
		return next();
	}
}
