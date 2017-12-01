var express = require('express'),
  router = express.Router(),
	mongoose = require('mongoose');
	
var user = mongoose.model('zlove_users');

module.exports = function (app, passport) {
  app.use('/admin', isLoggedIn, router);
};

router.get('/', function(req, res, next){
	res.redirect('/admin/dashboard');
});

router.get('/dashboard', function(req, res, next){
  res.render('admin/pages/dashboard', {
  		layout	: 'admin/master',
    	title	: 'Dashboard',
    	admin 	: req.session.adminuser,
    	csrf 	: req.csrfToken(),
    	script 	: null
    });
});

router.get('/logout', function(req, res){
	delete req.session.authenticated;
	delete req.session.adminuser;
	res.redirect('/auth/login');
});

router.get('/users', function(req, res, next){
	user.find({}, function(err, data){
		if (err) throw err;
		var total = data.length;
		user.find({Status: 1}, function(err, result){
			if (err) throw err;
			var activeUser = result.length;
			var inActiveUser = total - activeUser;
			var statUser = {
				total: total,
				active: activeUser,
				inactive: inActiveUser
			};
			res.render('admin/pages/users', {
				layout 		: 'admin/master',
				title		: 'Users manager',
				csrf 		: req.csrfToken(),
				admin 		: req.session.adminuser,
				statUser : statUser,
				script		: 'admin/assets/apps/js/users.js'
			});
		});
	});
});

router.get('/posts', function(req, res, next){
	res.render('admin/pages/posts', {
		layout 		: 'admin/master',
		title		: 'Posts manager',
		csrf 		: req.csrfToken(),
		admin 		: req.session.adminuser,
		script		: 'admin/assets/apps/js/posts.js'
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
