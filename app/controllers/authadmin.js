var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');
var bcrypt = require('bcrypt');

//define model and collection
var admin  = mongoose.model('Admins');

module.exports = function (app) {
  app.use('/auth', isLoggedIn, router);
};

//get -> render views
router.get('/login', function(req, res, next){
	console.log(req.session.authenticated);
	res.render('admin/pages/login', {
		title: 'Zlove Admin | Login',
		message: req.flash('loginMessage')
	});
});


//method POST solve params send from view to server
router.post('/login', function(req, res, next){
	//body is called from body-parser libs
	var username	= req.body.username; //.username is input name attribute. Exp: <input name="username">
	var password 	= req.body.password; //.password is input name attribute. Exp: <input name="password">

	//get data from mongodb via model mongoose
	admin.findOne({username: username}, function(err, data){

		//if has err, throw error
		if (err) {
			console.log(err);
			req.flash('loginMessage', 'Something went wrong! Try again.');
			res.render('admin/pages/login', {
				title: 'Zlove Admin | Login',
				message: req.flash('loginMessage')
			});
			return 0;
		}
		//if data == null => user not found
		if (!data) {
			req.flash('loginMessage', 'User not found.');
			console.log("not found");
			res.render('admin/pages/login', {
				title: 'Zlove Admin | Login',
				message: req.flash('loginMessage')
			});
			return 0;
		}

		//checking valid password
		if (!data.validPassword(password)) {
			req.flash('loginMessage', 'Invalid password');
			console.log("fail");
			res.render('admin/pages/login', {
				title: 'Zlove Admin | Login',
				message: req.flash('loginMessage')
			});
			return 0;
		}

		//done
		console.log("done");
		//set session auth = true to another routes checking
		//BE CAREFUL: because session is storaged in browser, in homepage can get session.authenticated too.
		//In homepage, should you use other session, exp: session.homepageauth, ...
		req.session.authenticated = true;
		req.session.adminuser = {
			username: data.username,
			email: data.email
		};
		res.redirect('/admin/');
	});
});




// Check is existed sesssion called authenticated
// if session[authenticated] == true => redirect to admin
// else to be login containue
function isLoggedIn(req, res, next){
	if (!req.session || !req.session.authenticated) {
		return next();
	}
	else{
		res.redirect('/admin/');
	}
}