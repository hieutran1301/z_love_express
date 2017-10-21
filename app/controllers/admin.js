var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article');

module.exports = function (app, passport) {
  app.use('/admin', isLoggedIn, router);
};

router.get('/', function(req, res, next){
	res.redirect('/dashboard');
});

router.get('/dashboard', function(req, res, next){
  res.render('admin/pages/dashboard', {
  		layout: 'admin/master',
    	title: 'Dashboard'
    });
});

router.get('/login', function(req, res, next){
	res.render('admin/pages/login', {
		title: 'Zlove Admin | Login'
	});
});

function isLoggedIn(req, res, next){
	if (req.isAuthenticated()) {
		return next();
	}
	else{
		res.redirect('/auth/login');
	}
}

