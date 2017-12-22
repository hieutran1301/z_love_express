var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');

var user = mongoose.model('zlove_users');

module.exports = function (app, passport) {
  app.use('/app-api', router);
};

router.get('/exist/:username/:password', function (req, res, next) {
  var username = req.params.username;
  var password = req.params.password;

  console.log(username);
  console.log(password);


  user.findOne({Username: username}, function (err, data) {
    //if data == null => user not found
    if (!data) {
      res.status(404);
      return 0;
    } else {
      if (!data.validPassword(password)) {
        res.status(404);
      } else {
        res.send("Login success.")
      }
    }
  });
});

router.get('/create/:firstName/:lastName/:username/:mail/:password', function(req, res){
  var firstName = req.params.firstName;
  var lastName  = req.params.lastName;
  var email     = req.params.email;
  var username  = req.params.username;
  var password  = req.params.password;

  console.log(firstName);

  user.findOne({Username: username}, function (err, data) {
    //if data == null => user not found
    if (!data) {
      res.status(404);
      return 0;
    } else {
      if (!data.validPassword(password)) {
        res.status(404);
      } else {
        res.send("Login success.")
      }
    }
  });
  
});
