var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');

var user = mongoose.model('zlove_users');
var m_post = mongoose.model('zlove_posts');
var bcrypt = require('bcrypt');

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


router.post('/signup', (req, res, next)=>{
    console.log(req.body);
  var firstName = req.body.firstName;
  var lastName  = req.body.lastName;
  var email     = req.body.email;
  var username  = req.body.username;
  var password  = req.body.password; 
  
  if (firstName == undefined || firstName == null || firstName == '') {
      res.sendStatus(404);
      return 0;
  }

  if (lastName == undefined || lastName == null || lastName == '') {
      res.sendStatus(404);
      return 0;
  }

  if (email == undefined || email == null || email == '') {
      res.sendStatus(404);
      return 0;
  } else{
      let query = user.findOne({Email: email}, function(err, data){
        if (data){
            res.status(404).send('Email has existed');
        }
      });
  }

  if (username == undefined || username == null || username == '') {
      res.sendStatus(404);
      return 0;
  } else{
      let query = user.findOne({Username: username}, (err, data)=>{
          if (data){
            res.status(404).send('Username has existed');
          }
      });
  }

  if (password == undefined || password == null || password == '') {
      res.sendStatus(404);
      return 0;
  }

    var now 		= new Date();
    var saltRounds 	= 8;
    var plainPass 	= password;
    var createdDate = ''+now.getDate()+'/'+(now.getMonth()+1)+'/'+now.getFullYear();

  try {
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(plainPass, salt, function(err, hash) {
            newUser = new user({
                "Username" : username,
                "Password" : hash,
                "Email" : email,
                "DateOfBirth" : "",
                "CurrentPlace" : 29,
                "FirstName" : firstName,
                "LastName" : lastName,
                "Gender" : 1,
                "Working" : 1,
                "WorkingAt" : "",
                "Relationship" : 1,
                "Phone" : "",
                "Facebook" : "",
                "Skype" : "",
                "Introduction" : "",
                "PlaceOfBirth" : 29,
                "CreatedDate" : createdDate,
                "Avatar" : "",
                "SocketID" : '',
                "Online" : 0,
                "Setting" :{
                  "isHiddenBirthday" : 0,
                  "isHiddenPlaceOfBirth" : 0,
                  "isHiddenCurrentPlace" : 0
                },
                "Status" : 1
            });

            newUser.save(function(err, result){
                if (err) throw err;
                if(result._id){
                    res.sendStatus(200);
                }
                else{
                    res.sendStatus(501);
                }
            });
        });
    });
  } catch (error) {
      console.log("ERROR@APP-API/general: "+error);
      res.sendStatus(500);
  }
});


router.get('/getpost', (req, res, next)=>{
    m_post.aggregate([
        {$lookup: 
            {
                from: "zlove_users",
                localField: "_id.str",
                foreignField: "CreatedBy",
                as: "CreatedBy"
            }
        },
        {$unwind: "$CreatedBy"},
        {$project:
            {
                _id: 0,
                Title: 1,
                Target: 1,
                FromAge: 1,
                ToAge: 1,
                City: 1,
                Job: 1,
                Description: 1,
                CreatedDate: 1,
                CreatedBy: "$CreatedBy.Username",
                Avatar: "$CreatedBy.Avatar"
            }
        }
    ]).exec(function(err, data){
        res.send(data);
    });
});

router.get('/getpost/:limit/:skip', (req, res, next)=>{
    var skip = (req.params.skip)*1;
    var limit= (req.params.limit)*1;
    m_post.aggregate([
        {$lookup: 
            {
                from: "zlove_users",
                localField: "_id.str",
                foreignField: "CreatedBy",
                as: "CreatedBy"
            }
        },
        {$unwind: "$CreatedBy"},
        {$project:
            {
                _id: 0,
                Title: 1,
                Target: 1,
                FromAge: 1,
                ToAge: 1,
                City: 1,
                Job: 1,
                Description: 1,
                CreatedDate: 1,
                CreatedBy: "$CreatedBy.Username",
                Avatar: "$CreatedBy.Avatar"
            }
        },
        {$skip: skip},
        {$limit: limit}
    ]).exec(function(err, data){
        res.send(data);
    });
});