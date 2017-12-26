var express = require('express'),
router = express.Router(),
mongoose = require('mongoose');

var user = mongoose.model('zlove_users');
var zlove_messages = mongoose.model('zlove_messages');
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


router.post('/messenger', async function(req, res, next){
  var _option = req.body.option;

  if (_option == 'getMess'){
    var selfID    = req.session.homeuserid;
    var targetID  = req.body.targetID;

    console.log("selfID: "+selfID);
    console.log("targetID: "+targetID);
    
    try {
      let obj_user    = await user.findOne({_id: selfID});
      let obj_target  = await user.findOne({_id: targetID});
      zlove_messages.aggregate([
              {$match:  {
                $or: [
                    {FromID: selfID, ToID: targetID},
                    {ToID: selfID, FromID: targetID}
                ]
            }
        },
        {$sort: {"created_at": 1}}
      ], function(err, data){
        if (data){
          res.send({
            Userinfo: {
              Self: {
                Username: obj_user.Username,
                Avatar: getURLAvatar(obj_user.Avatar)
              },
              Target: {
                Username: obj_target.Username,
                Avatar: getURLAvatar(obj_target.Avatar)
              }
            },
            Messages: data
          });
        } 
        else{
          res.status(404).send(data);
        }
      });
    } catch (error) {
      console.log("ERROR@AJAX_HOMEPAGE: "+error);
      res.status(500).send('Server error');
    }
  }

  if (_option == 'getPerson'){
    var crrUserID = req.session.homeuserid;

    try {
      // let psDistinct = await zlove_messages.distinct("ToID", {$or: [{FromID: crrUserID},{ToID: crrUserID}]});
      let psDistinct = await zlove_messages.aggregate([
        {
          "$match": {$or: [{FromID: crrUserID},{ToID: crrUserID}]}
        },
        {
          "$group": {_id: "$ToID", lastMess: {$last: "$created_at"}}
        },
        {
          "$sort": {"lastMess": -1}
        }
      ]);
      console.log(psDistinct);
      let lastMess = [];
      for (var i=0; i<psDistinct.length; i++){
        if (psDistinct[i]._id != crrUserID){
          let query = await zlove_messages.findOne({$or: [
            {FromID: psDistinct[i]._id, ToID: crrUserID}, 
            {ToID: psDistinct[i]._id, FromID: crrUserID}
          ]}).sort({created_at: -1}).exec();
          if (query.FromID == crrUserID){
            let query_user = await user.findOne({_id: query.ToID});
            let amess = {
              Username : query_user.Username,
              Avatar   : query_user.Avatar,
              Time     : query.Timestamp,
              Content  : query.Content
            }
            lastMess.push(amess);
          }
          else{
            let query_user = await user.findOne({_id: query.FromID});
            let amess = {
              Username : query_user.Username,
              Avatar   : query_user.Avatar,
              Time     : query.Timestamp,
              Content  : query.Content
            }
            lastMess.push(amess);
          }
        }
      }
      
      res.status(200).send(lastMess);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }
});

function getURLAvatar(rootPathAvatar){
  rootPathAvatar = rootPathAvatar.split('\\');
  return '/uploads/'+rootPathAvatar[2];
}