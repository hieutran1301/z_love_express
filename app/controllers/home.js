var express = require('express'),
  router    = express.Router(),
  mongoose  = require('mongoose'),
  Article   = mongoose.model('Article'),
  user      = mongoose.model('zlove_users'),
  cities    = require('../../libs/city');

module.exports = function (app) {
  app.use('/home', isLoggedIn, router);
};

router.get('/login', function(req, res, next){
  res.render('web/pages/login', {
      title: 'Login',
      csrf 		: req.csrfToken()
    });
});

router.get('/signup', function(req, res, next){
  res.render('web/pages/signup', {
      title: 'Signup',
      csrf 		: req.csrfToken()
    });
});
router.get('/homepage', function(req, res, next){
  res.render('web/pages/homepage', {
      title: 'Homepage',
      csrf 		: req.csrfToken()
    });
});

router.get('/noti', function(req, res, next){
  res.render('web/pages/noti', {
      title: 'Notification',
      csrf 		: req.csrfToken()
    });
});

router.get('/about', function(req, res, next){
  res.render('web/pages/about', {
      title: 'About',
      csrf 		: req.csrfToken()
    });
});

router.get('/messenger', function(req, res, next){
  res.render('web/pages/messenger', {
      title: 'Messenger',
      csrf 		: req.csrfToken()
    });
});

router.get('/profile', function(req, res, next){
  res.render('web/pages/profile', {
      title: 'Profile'
    });
});

router.get('/profile-new', function(req, res, next){
  var userID = req.session.homeuserid;
  user.findOne({_id: userID}, function(err, data){
    if (err) throw err;
    if (!data){
      res.redirect('/home/');
    }
    else{
      res.render('web/pages/profile_new', {
        title: 'Profile',
        csrf: req.csrfToken(),
        userid: req.session.homeuserid,
        self: true,
        data: {
          fullname    : data.FirstName+' '+data.LastName,
          age         : data.getAge(),
          birthday    : data.DateOfBirth,
          relation    : "Độc thân",
          gender      : data.getGender(),
          crrPlace    : data.getCity(data.CurrentPlace),
          working     : data.Working,
          workingat   : "ĐH Công nghệ thông tin - ĐHQG HCM",
          avatar      : data.getAvatar(),
          cities      : cities,
          noCrrPlace  : data.CurrentPlace
        }
      });
    }
  });
});

router.get('/profile-new/:username', function(req, res, next){
  var username = req.params.username;
  var self     = false;
  user.findOne({Username: username}, function(err, data){
    if (err) throw err;
    if (!data){
      res.redirect('/home/');
    }
    else{
      if (data._id == req.session.homeuserid) self = true;
      res.render('web/pages/profile_new', {
        title: 'Profile',
        csrf: req.csrfToken(),
        userid: req.session.homeuserid,
        self: self,
        data: {
          fullname    : data.FirstName+' '+data.LastName,
          age         : data.getAge(),
          birthday    : data.DateOfBirth,
          relation    : "Độc thân",
          gender      : data.getGender(),
          crrPlace    : data.getCity(data.CurrentPlace),
          working     : data.Working,
          workingat   : "ĐH Công nghệ thông tin - ĐHQG HCM",
          avatar      : data.getAvatar(),
          cities      : cities,
          noCrrPlace  : data.CurrentPlace
        }
      });
    }
  });
});

router.get('/', function (req, res, next) {
  Article.find(function (err, articles) {
    if (err) return next(err);
    res.render('web/pages/homepage',
     {
      title: 'Zlove',
      articles: articles,
         csrf 		: req.csrfToken()
    });
  });
});

router.get('/logout', function(req, res){
	delete req.session.homeauthenticated;
	delete req.session.homeuserid;
	res.redirect('/home-auth/login');
});

function isLoggedIn(req, res, next){
  if (!req.session || !req.session.homeauthenticated) {
    res.redirect('/home-auth/login');
  }
  else{
    return next();
  }
}