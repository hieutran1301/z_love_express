var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article');

module.exports = function (app) {
  app.use('/home', isLoggedIn, router);
};

router.get('/login', function(req, res, next){
  res.render('web/pages/login', {
      title: 'Login'
    });
});

router.get('/signup', function(req, res, next){
  res.render('web/pages/signup', {
      title: 'Signup'
    });
});
router.get('/homepage', function(req, res, next){
  res.render('web/pages/homepage', {
      title: 'Homepage'
    });
});

router.get('/noti', function(req, res, next){
  res.render('web/pages/noti', {
      title: 'Notification'
    });
});

router.get('/', function (req, res, next) {
  Article.find(function (err, articles) {
    if (err) return next(err);
    res.render('web/pages/homepage',
     {
      title: 'Zlove',
      articles: articles
    });
  });
});

function isLoggedIn(req, res, next){
  if (!req.session || !req.session.homeauthenticated) {
    res.redirect('/home-auth/login');
  }
  else{
    return next();
  }
}