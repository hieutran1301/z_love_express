var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article');

module.exports = function (app) {
  app.use('/', router);
};


router.get('/admin/dashboard', function(req, res, next){
  res.render('admin/pages/dashboard', {
  		layout: 'admin/master',
      title: 'Dashboard'
    });
});

