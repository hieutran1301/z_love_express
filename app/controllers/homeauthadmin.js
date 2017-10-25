var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');
var bcrypt = require('bcrypt');

//define model and collection
var users  = mongoose.model('user1');

module.exports = function (app) {
  app.use('/home-auth', isLoggedIn, router);
};

//get -> render views
router.get('/login', function(req, res, next){
	
	res.render('web/pages/login', {
		title: 'Zlove | Login',
		message: req.flash('loginMessage')
	});
});


//method POST solve params send from view to server
router.post('/login', function(req, res, next){
	//body is called from body-parser libs
	var username	= req.body.username; //.username is input name attribute. Exp: <input name="username">
	var password 	= req.body.password; //.password is input name attribute. Exp: <input name="password">
	
	//get data from mongodb via model mongoose
	users.findOne({username: username}, function(err, data){
		console.log(username);
		//if has err, throw error
		if (err) {
			console.log(err);
			req.flash('loginMessage', 'Something went wrong! Try again.');
			res.render('web/pages/login', {
				title: 'Zlove | Login',
				message: req.flash('loginMessage')
			});
			return 0;
		}
		//if data == null => user not found
		if (!data) {
			req.flash('loginMessage', 'User not found.');
			console.log("not found");
			res.render('web/pages/login', {
				title: 'Zlove | Login',
				message: req.flash('loginMessage')
			});
			return 0;
		}

		//checking valid password
		if (!data.validPassword(password)) {
			req.flash('loginMessage', 'Invalid password');
			console.log("fail");
			res.render('web/pages/login', {
				title: 'Zlove | Login',
				message: req.flash('loginMessage')
			});
			return 0;
		}

		//done
		console.log("done");
		//set session auth = true to another routes checking
		//BE CAREFUL: because session is storaged in browser, in homepage can get session.authenticated too.
		//In homepage, should you use other session, exp: session.homepageauth, ...
		req.session.homeauthenticated = true;
		res.redirect('/home/');
	});
});




// Check is existed sesssion called authenticated
// if session[authenticated] == true => redirect to admin
// else to be login containue
function isLoggedIn(req, res, next){
	if (!req.session || !req.session.homeauthenticated) {
		return next();
	}
	else{
		res.redirect('/home/');
	}
}