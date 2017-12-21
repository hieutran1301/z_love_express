var express = require('express'),
  router    = express.Router(),
  mongoose  = require('mongoose'),
  Article   = mongoose.model('Article'),
  user      = mongoose.model('zlove_users'),
  cities    = require('../../libs/city');

var posts = mongoose.model('zlove_posts');


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
      csrf 		: req.csrfToken(),
      script 	: null
    });
});

router.get('/post', function(req, res, next){
  res.render('web/pages/employer', {
      title: 'Zlove | Đăng tin',
      csrf 		: req.csrfToken(),
      cities      : cities,
      message : ''
    });
});

router.post('/post', function (req, res, next) {
  var userID    = req.session.homeuserid;
  var title     = req.body.posttitle;
  var target    = req.body.target;
  var fromAge   = req.body.agemin;
  var toAge     = req.body.agemax;
  var local     = req.body.local;
  var job       = req.body.job;
  var content   = req.body.postcontent;

  var now 		= new Date();
  var createdDate = ''+now.getDate()+'/'+(now.getMonth()+1)+'/'+now.getFullYear();

  posts.findOne({"CreatedBy": userID},function (err, data) {
    if (err) {
      req.flash('postMessage', 'Error');
      console.log("Error");
      res.render('web/pages/employer', {
        title		: 'Zlove | Đăng tin',
        csrf 		: req.csrfToken(),
        cities		: cities,
        message 	: req.flash('postMessage')
      });
      return 0;
    }
    if(!data){
      newUser = new posts({
        "Title"   : title,
        "Target"  : target,
        "FromAge" : fromAge,
        "ToAge"   : toAge,
        "City"    : local,
        "Job"     : job,
        "Description" : content,
        "CreatedDate" : createdDate,
        "CreatedBy"   : userID,
        "EditedDate"  : '',
        "View"        : 0,
        "NumberApply" : 0,
        "Status"      : 0

      });

      newUser.save(function (err, result) {
        if (err) throw err;
        if (result._id) {
          req.flash('postMessage', 'Success');
          console.log("Success");
          res.render('web/pages/employer', {
            title		: 'Zlove | Đăng tin',
            csrf 		: req.csrfToken(),
            cities		: cities,
            message 	: req.flash('postMessage')
          });
        }
      });
      return 0;
    }
    if(data){
      req.flash('postMessage', 'Err');
      console.log("Error");
      res.render('web/pages/employer', {
        title		: 'Zlove | Đăng tin',
        csrf 		: req.csrfToken(),
        cities		: cities,
        message 	: req.flash('postMessage')
      });
    }
  });


});

router.get('/about', function(req, res, next){
  res.render('web/pages/about', {
      title: 'About',
      csrf 		: req.csrfToken()
    });
});


router.get('/setting', function(req, res, next){
  res.render('web/pages/setting', {
      title: 'Zlove | Setting',
      message: req.flash('msSetting'),
      csrf    : req.csrfToken()
    });
});

router.post('/setting', function(req, res, next){
  var username        = req.body.inpusername;
  var password        = req.body.inppassword;
  var repeatpassword  = req.body.inprepeatpassword;
  var dayofbirth      = req.body.DayofBirth;
  var placeofbirth    = req.body.PlaceofBirth;
  var address         = req.body.Address;
  var deactivacc      = req.body.Deactive;
  var deleteacc       = req.body.Delete;

console.log("da nhan " + username, password, repeatpassword, dayofbirth, placeofbirth, address, deactivacc, deleteacc );
console.log(validPassword(password, repeatpassword));
  if(validUsername(username) == true){
  users.findOne({Username:username}, function(err,data) {
    if(err){
      console.log(err);
      req.flash('signupMessage', 'Something went wrong! Try again.');
      res.render('web/pages/setting', {
        title: 'Zlove | Setting',
        message: req.flash('msSetting'),
        csrf    : req.csrfToken(),
      });
      return 0;
    }
    if(data){
      req.flash('msSetting', 'Username đã tồn tại');
      console.log("Fail");
      res.render('web/pages/setting', {
        title: 'Zlove | Setting',
        csrf: req.csrfToken(),
        message: req.flash('msSetting')
      });
      return 0;
    }else{
      user.updateOne({_id: userID}, {
      Username        : username,
      
    }, function(err, result){
      if(err) {
        req.flash('msSetting', 'fail');
        throw err;
        res.redirect('/home/setting');
      }
      else{
        req.flash('msSetting', 'success');
        res.redirect('/home/setting');
      }
      });
    }
  });
  }

  if (validPassword(password, repeatpassword) == false){
    req.flash('msSetting', 'Password do not match');
    res.render('web/pages/setting', {
      title: 'Zlove | Setting',
      message: req.flash('msSetting'),
      csrf    : req.csrfToken()
    });
    return 0;
  }else{
      user.updateOne({_id: userID}, {
      Password        : password,
      
    }, function(err, result){
        req.flash('msSetting', 'password changed');
        res.redirect('/home/setting');
        console.log("đã thay đổi password");
      });
    }


  res.render('web/pages/setting', {
      title: 'Setting',
      csrf    : req.csrfToken(),
      message: req.flash('msSetting')
    });
});

router.get('/messenger', function(req, res, next){
  res.render('web/pages/messenger', {
      title: 'Messenger',
      csrf 		: req.csrfToken()
    });
});

router.get('/messenger_new', function(req, res, next){
  res.render('web/pages/messenger_new', {
    title: 'Messenger',
    csrf 		: req.csrfToken()
  });
});

router.get('/messenger_new/:targetUsername', function(req, res, next){
  var targetUsername = req.params.targetUsername;
  user.findOne({Username: targetUsername}, function(err, data){
    if (err) throw err;
    if (data){
      var targetId = data._id;
      var sending  = {
        FullName: data.FirstName+' '+data.LastName,
        Online  : data.Online,
      }
      res.render('web/pages/messenger_new', {
        title: 'Messenger',
        csrf 		: req.csrfToken(),
        targetId : targetId,
        data    : sending
      });
    }
    else{
      res.render('web/pages/profile_notfound', {
        title: 'Profile not found',
      });
    }
  });
});

router.get('/apply', function(req, res, next){
  res.render('web/pages/apply', {
      title: 'Apply',
      csrf    : req.csrfToken()
    });
});

router.get('/profile', function(req, res, next){
  res.render('web/pages/profile', {
      title: 'Profile'
    });
});

router.post('/profile-new', function(req, res, next){
  var userID    = req.session.homeuserid;
  var gender    = req.body.sltGender;
  var birthday  = req.body.inpBirthday;
  var crrPlace  = req.body.sltCurrPlace;
  var relation  = req.body.sltRela;
  var working   = req.body.sltWorking;
  var workingat = req.body.inpWorkingPlace;
  var firstname = req.body.inpFirstname;
  var lastname  = req.body.inpLastname;
  var intro     = req.body.introduction;

  user.updateOne({_id: userID}, {
    Gender        : gender,
    DateOfBirth   : birthday,
    CurrentPlace  : crrPlace,
    Relationship  : relation,
    Working       : working,
    WorkingAt     : workingat,
    FirstName     : firstname,
    LastName      : lastname,
    Introduction  : intro
  }, function(err, result){
    if(err) {
      req.flash('saveBasicInfo', 'fail');
      throw err;
      res.redirect('/home/profile-new');
    }
    else{
      req.flash('saveBasicInfo', 'success');
      res.redirect('/home/profile-new');
    }
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
        message: req.flash('saveBasicInfo'),
        self: true,
        data: {
          firstname   : data.FirstName,
          lastname    : data.LastName,
          fullname    : data.FirstName+' '+data.LastName,
          age         : data.getAge(),
          birthday    : data.DateOfBirth,
          relation    : data.Relationship,
          gender      : data.Gender,
          txtgender   : data.getGender(),
          crrPlace    : data.getCity(data.CurrentPlace),
          working     : data.Working,
          txtworking  : data.getWorking(),
          workingat   : data.WorkingAt,
          avatar      : data.getAvatar(),
          cities      : cities,
          noCrrPlace  : data.CurrentPlace,
          intro       : data.Introduction
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
      res.render('web/pages/profile_notfound', {
        title: 'Profile not found',
      });
    }
    else{
      if (data.Status == 1){
        if (data._id == req.session.homeuserid) self = true;
        res.render('web/pages/profile_new', {
          title: 'Profile',
          csrf: req.csrfToken(),
          userid: req.session.homeuserid,
          message: req.flash('saveBasicInfo'),
          self: self,
          data: {
            firstname   : data.FirstName,
            lastname    : data.LastName,
            fullname    : data.FirstName+' '+data.LastName,
            age         : data.getAge(),
            birthday    : data.DateOfBirth,
            relation    : data.Relationship,
            gender      : data.Gender,
            txtgender   : data.getGender(),
            crrPlace    : data.getCity(data.CurrentPlace),
            working     : data.Working,
            txtworking  : data.getWorking(),
            workingat   : data.WorkingAt,
            avatar      : data.getAvatar(),
            cities      : cities,
            noCrrPlace  : data.CurrentPlace,
            intro       : data.Introduction
          }
        });
      }
      else{
        res.render('web/pages/profile_notfound', {
          title: 'Profile not found',
        });
      }
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
       csrf 		: req.csrfToken(),
       script 	: null
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


function validPassword(password, repeatpassword){
  if(password != repeatpassword) {
  return false;
  }
  else{
  return true;
  }
}