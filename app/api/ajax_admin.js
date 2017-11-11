var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');

var promise = require('q');
var fs 		= require('fs');

var user = mongoose.model('zlove_users');
var bcrypt = require('bcrypt');
var city = require('../../libs/city');
var crypto = require('crypto');
var path = require('path');
let multer 	= require('multer');
var storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: function (req, file, cb) {
	  crypto.pseudoRandomBytes(16, function (err, raw) {
		if (err) return cb(err)
  
		cb(null, raw.toString('hex') + path.extname(file.originalname))
	  })
	}
  });
let upload 	= multer({
	storage: storage,
});

module.exports = function (app, passport) {
  app.use('/ajax-admin', router);
};

router.get('/cities', function(req, res, next){
	res.send(city);
});

router.post('/', function(req, res, next){
	let _option = req.body.option;
	console.log(_option);

	if (_option == 'getUsers') {
		user.find(function(err, data){
			if (err) {res.send({error: 'error'}); return;}
			if (!data) {
				res.send(404);
				return;
			}
			else{
				res.send(data);
				return;
			}
		});
	}

	if (_option == 'removeUser') {
		var id = req.body.id;
		var path = '';
		user.findOne({_id: id}, function(err, result){
			
			path = result.Avatar;
			console.log('ava path: '+path);
			if(path != ''){
				fs.unlink(path, function(err){
					if (err){
						console.log(err);
					}
					console.log('Deleted file');
					user.findOne({_id: id}).remove(function(){
						res.sendStatus(200);
						return;
					});
				});
			}
		});
		// user.find({_id: id}).remove(function(){
		// 	res.sendStatus(200);
		// 	return;
		// });
	}
});

router.post('/add', upload.single('avatar'), function(req, res, next){
	var avatar 		= req.file;
	var data 	= req.body;
	
	if (avatar){
		var path 		= avatar.path;
		var now 		= new Date();
		var saltRounds 	= 8;
		var plainPass 	= data.password;
		var createdDate = ''+now.getDate()+'/'+(now.getMonth()+1)+'/'+now.getFullYear();

		bcrypt.genSalt(saltRounds, function(err, salt) {
			bcrypt.hash(plainPass, salt, function(err, hash) {
				newUser = new user({
					"Username" : data.username,
					"Password" : hash,
					"Email" : data.email,
					"DateOfBirth" : data.birthday,
					"CurrentPlace" : data.city,
					"FirstName" : data.firstname,
					"LastName" : data.lastname,
					"Gender" : data.gender,
					"Working" : '',
					"Phone" : data.phone,
					"Facebook" : data.facebook,
					"Skype" : data.skype,
					"Introduction" : data.introduction,
					"PlaceOfBirth" : data.birthplace,
					"CreatedDate" : createdDate,
					"Avatar" : path,
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
	}
	else{

	}
});