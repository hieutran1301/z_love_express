var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var city = require('../../libs/city');
//define model and collection
var users  = mongoose.model('zlove_users');


module.exports = function (app) {
  app.use('/home-auth', isLoggedIn, router);
};

//get -> render views
router.get('/login', function(req, res, next){

	res.render('web/pages/login', {
		title		: 'Zlove | Login',
		message 	: req.flash('loginMessage'),
		csrf 		: req.csrfToken()
	});
});
router.get('/signup', function(req, res, next){

	res.render('web/pages/signup', {
		title		: 'Zlove | Signup',
		csrf 		: req.csrfToken(),
		city		: city,
    message 	: req.flash('signupMessage')
	});
});


//method POST solve params send from view to server
router.post('/login', function(req, res, next){
	//body is called from body-parser libs
	var username	= req.body.username; //.username is input name attribute. Exp: <input name="username">
	var password 	= req.body.password; //.password is input name attribute. Exp: <input name="password">

	//get data from mongodb via model mongoose
	users.findOne({Username: username}, function(err, data){
		console.log(username);
		//if has err, throw error
		if (err) {
			console.log(err);
			req.flash('loginMessage', 'Something went wrong! Try again.');
			res.render('web/pages/login', {
				title: 'Zlove | Login',
				message: req.flash('loginMessage'),
                csrf 		: req.csrfToken()
			});
			return 0;
		}
		//if data == null => user not found
		if (!data) {
			req.flash('loginMessage', 'User not found.');
			console.log("not found");
			res.render('web/pages/login', {
				title: 'Zlove | Login',
				message: req.flash('loginMessage'),
                csrf 		: req.csrfToken()
			});
			return 0;
		}

		//checking valid password
		if (!data.validPassword(password)) {
			req.flash('loginMessage', 'Invalid password');
			console.log("fail");
			res.render('web/pages/login', {
				title: 'Zlove | Login',
				message: req.flash('loginMessage'),
                csrf 		: req.csrfToken()
			});
			return 0;
		}

		//done
		console.log("done");
		//set session auth = true to another routes checking
		//BE CAREFUL: because session is storaged in browser, in homepage can get session.authenticated too.
		//In homepage, should you use other session, exp: session.homepageauth, ...
		req.session.homeauthenticated = true;
		req.session.homeuserid = data._id;
		console.log(req.session.homeuserid);
		res.redirect('/home/');
		return 0;
	});
});

router.post('/signup', function (req, res, next) {
	var firstname 		  = req.body.firstname;
	var lastname 		    = req.body.lastname;
	var sex			      	= req.body.sex;
	var work		      	= req.body.work;
	var day			      	= req.body.day;
	var month		      	= req.body.month;
	var year		      	= req.body.year;
	var local		      	= req.body.local;
	var youarrive	    	= req.body.youarrive;
	var email			      = req.body.email;
	var username		    = req.body.username;
	var password		    = req.body.password;
	var repeatpassword	= req.body.repeatpassword;

  users.findOne({Username: username}, function(err, data){
    console.log(username);
    //if has err, throw error
    if (err) {
      console.log(err);
      req.flash('signupMessage', 'Something went wrong! Try again.');
      res.render('web/pages/signup', {
        title: 'Zlove | Login',
        messages: req.flash('signupMessage'),
        csrf 		: req.csrfToken()
      });
      return 0;
    }
    //if data == null => user not found
    if (!data) {
      req.flash('signupMessage', 'User not found.');
      console.log("not found");
      res.render('web/pages/signup', {
        title: 'Zlove | Login',
        messages: req.flash('signupMessage'),
        csrf 		: req.csrfToken()
      });
      return 0;
    }

    //done
    console.log("done");
    //set session auth = true to another routes checking
    //BE CAREFUL: because session is storaged in browser, in homepage can get session.authenticated too.
    //In homepage, should you use other session, exp: session.homepageauth, ...
    req.session.homeauthenticated = true;
    req.session.homeuserid = data._id;
    console.log(req.session.homeuserid);
    res.redirect('/home/');
    return 0;
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

function CheckNull(req, res, next) {
  if (firstname == '' || firstname == null){
    req.flash('signupMessage', 'Bạn chưa nhập họ');
    console.log("fail");
    res.render('web/pages/signup', {
      title: 'Zlove | Signup',
      message: req.flash('signupMessage'),
      csrf 		: req.csrfToken()
    });
    return 0;
  }

  if (lastname == '' || lastname == null){
    req.flash('signupMessage', 'Bạn chưa nhập tên');
    console.log("fail");
    res.render('web/pages/signup', {
      title: 'Zlove | Signup',
      message: req.flash('signupMessage'),
      csrf 		: req.csrfToken()
    });
    return 0;
  }

  if (sex == '' || sex == null){
    req.flash('signupMessage', 'Bạn chưa chọn giới tính');
    console.log("fail");
    res.render('web/pages/signup', {
      title: 'Zlove | Signup',
      message: req.flash('signupMessage'),
      csrf 		: req.csrfToken()
    });
    return 0;
  }
  if (work == '' || work == null){
    req.flash('signupMessage', 'Bạn chưa nhập công việc');
    console.log("fail");
    res.render('web/pages/signup', {
      title: 'Zlove | Signup',
      message: req.flash('signupMessage'),
      csrf 		: req.csrfToken()
    });
    return 0;
  }

  if (day == '' || day == null || day == 0){
    req.flash('signupMessage', 'Bạn chưa nhập ngày sinh');
    console.log("fail");
    res.render('web/pages/signup', {
      title: 'Zlove | Signup',
      message: req.flash('signupMessage'),
      csrf 		: req.csrfToken()
    });
    return 0;
  }

  if (month == '' || month == null || month == 0){
    req.flash('signupMessage', 'Bạn chưa nhập tháng sinh');
    console.log("fail");
    res.render('web/pages/signup', {
      title: 'Zlove | Signup',
      message: req.flash('signupMessage'),
      csrf 		: req.csrfToken()
    });
    return 0;
  }

  if (year == '' || year == null || year == 0){
    req.flash('signupMessage', 'Bạn chưa nhập năm sinh');
    console.log("fail");
    res.render('web/pages/signup', {
      title: 'Zlove | Signup',
      message: req.flash('signupMessage'),
      csrf 		: req.csrfToken()
    });
    return 0;
  }

  if (local == '' || local == null){
    req.flash('signupMessage', 'Bạn chưa nhập nơi ở');
    console.log("fail");
    res.render('web/pages/signup', {
      title: 'Zlove | Signup',
      message: req.flash('signupMessage'),
      csrf 		: req.csrfToken()
    });
    return 0;
  }

  if (email == '' || email == null){
    req.flash('signupMessage', 'Bạn chưa nhập Email');
    console.log("fail");
    res.render('web/pages/signup', {
      title: 'Zlove | Signup',
      message: req.flash('signupMessage'),
      csrf 		: req.csrfToken()
    });
    return 0;
  }

  if (username == '' || username == null){
    req.flash('signupMessage', 'Bạn chưa nhập tên đăng nhập');
    console.log("fail");
    res.render('web/pages/signup', {
      title: 'Zlove | Signup',
      message: req.flash('signupMessage'),
      csrf 		: req.csrfToken()
    });
    return 0;
  }

  if (password == '' || password == null){
    req.flash('signupMessage', 'Bạn chưa nhập password');
    console.log("fail");
    res.render('web/pages/signup', {
      title: 'Zlove | Signup',
      message: req.flash('signupMessage'),
      csrf 		: req.csrfToken()
    });
    return 0;
  }

  if (repeatpassword == '' || repeatpassword == null){
    req.flash('signupMessage', 'Bạn chưa nhập password');
    console.log("fail");
    res.render('web/pages/signup', {
      title: 'Zlove | Signup',
      message: req.flash('signupMessage'),
      csrf 		: req.csrfToken()
    });
    return 0;
  }
}

