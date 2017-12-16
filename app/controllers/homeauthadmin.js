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
    
    //check status of account
    if(data.Status != 1){
    	req.flash('loginMessage', 'User not found');
			console.log("fail");
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

  var now 		= new Date();
  var saltRounds 	= 8;
  var plainPass 	= password;
  var createdDate = ''+now.getDate()+'/'+(now.getMonth()+1)+'/'+now.getFullYear();
  var birthday = day + '/' + month + '/' + year;

  if (validateEmail(email) == false){
    req.flash('signupMessage', 'Email wrong! Try again.');
    res.render('web/pages/signup', {
      title: 'Zlove | Signup',
      message: req.flash('signupMessage'),
      csrf 		: req.csrfToken(),
      city : city
    });
    return 0;
  }

  users.findOne({Username:username}, function (err, data) {
    if(err){
      console.log(err);
      req.flash('signupMessage', 'Something went wrong! Try again.');
      res.render('web/pages/signup', {
        title: 'Zlove | Signup',
        message: req.flash('signupMessage'),
        csrf 		: req.csrfToken(),
        city : city
      });
      return 0;
    }
    if(!data){
      bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(plainPass, salt, function (err, hash) {
          console.log('add user');
          newUser = new users({
            "Username": username,
            "Password": hash,
            "Email": email,
            "DateOfBirth": birthday,
            "CurrentPlace": local + 1,
            "FirstName": firstname,
            "LastName": lastname,
            "Gender": sex,
            "Working": work,
            "WorkingAt": '',
            "Relationship": '',
            "Phone": '',
            "Facebook": '',
            "Skype": '',
            "Introduction": '',
            "PlaceOfBirth": '',
            "CreatedDate": createdDate,
            "Avatar": '',
            "SocketID" : '',
            "Online" : 0,
            "Setting" :{
              "isHiddenBirthday" : 0,
              "isHiddenPlaceOfBirth" : 0,
              "isHiddenCurrentPlace" : 0
            },
            "Status": 1
          });
          console.log('Done add user');
          newUser.save(function (err, result) {
            if (err) throw err;
            if (result._id) {
              req.flash('signupMessage', 'Success');
              console.log("Success");
              res.render('web/pages/signup', {
                title		: 'Zlove | Signup',
                csrf 		: req.csrfToken(),
                city		: city,
                message 	: req.flash('signupMessage')
              });
            }
          });
        });
      });
      return 0;
    }else {
      req.flash('signupMessage', 'Tài khoản đã tồn tại');
      console.log("Fail");
      res.render('web/pages/signup', {
        title: 'Zlove | Signup',
        csrf: req.csrfToken(),
        city: city,
        message: req.flash('signupMessage')
      });
      return 0;
    }
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

function validateEmail(email) {
  var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
  if (filter.test(email)) {
    return true;
  }
  else {
    return false;
  }
}

