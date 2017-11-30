var express = require('express'),
router = express.Router(),
mongoose = require('mongoose');

var user = mongoose.model('zlove_users');
var crypto = require('crypto');

var path = require('path');
let multer 	= require('multer');
var storageCroppedImage = multer.diskStorage({
	destination: './public/uploads/',
	filename: function (req, file, cb) {
	  crypto.pseudoRandomBytes(16, function (err, raw) {
		if (err) return cb(err);
  
    // cb(null, raw.toString('hex') + path.extname(file.originalname));
    cb(null, raw.toString('hex') + '.jpg');
	  })
	}
  });
let uploadCroppedImage 	= multer({
  storage: storageCroppedImage,
});

module.exports = function (app, passport) {
    app.use('/ajax-home', router);
};

router.post('/getuserbyid', function(req, res, next){
    var userid = req.body.id;
    user.findOne({_id: userid}, function(err, data){
        if (err) throw err;
        if(!data) res.sendStatus(404)
        else{
            res.send(data);
        }
    });
});

router.post('/checkusername', function (req, res, next) {
  var username = req.body.username;

  user.findOne({Username : username}, function (err, data) {
    if(!data){
      res.send('Success');
    }else {
      res.send('Fail');
    }
  });
});

router.post('/checkemail', function (req, res, next) {
  var email = req.body.email;

  user.findOne({Email: email}, function (err, data) {
    if(!data){
      res.send('emailSuccess');
    }else {
      res.send('emailFail');
    }
  })
});

router.post('/uploadavatarbycropper', uploadCroppedImage.single('croppedImage'), function(req, res, next){
  var avatar = req.file;
  var data   = req.body;
  var userid = data.userId;

  var path   = avatar.path;
  if  (path){
    user.updateOne({_id: userid}, {
      "Avatar": path,
    }, function(err, data){
      if (err) throw err;
      res.send({
        status: 'success',
        msg: 'Upload success'
      });
    });
  }
  else{
    res.send({
      status: 'err',
      msg   : 'Can not upload'
    });
  }
});