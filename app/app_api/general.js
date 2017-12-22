var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');

var user = mongoose.model('zlove_users');
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


router.post('/signup', async (req, res, next)=>{
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
      let query = await user.findOne({Email: email});
      if (query._id) {
          res.status(404).send('Email has existed');
          return 0;
      }
  }

  if (username == undefined || username == null || username == '') {
      res.sendStatus(404);
      return 0;
  } else{
      let query = await user.findOne({Username: username});
      if (query._id){
          res.status(404).send('Username has existed');
          return 0;
      }
  }

  if (password == undefined || password == null || password == '') {
      res.sendStatus(404);
      return 0;
  }

  console.log('FirstName: '+firstName);
  console.log('FirstName: '+lastName);
  console.log('FirstName: '+email);
  console.log('FirstName: '+username);
  console.log('FirstName: '+password);

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