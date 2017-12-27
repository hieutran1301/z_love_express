var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');

var promise = require('q');
var fs 		= require('fs');

var user = mongoose.model('zlove_users');
var post = mongoose.model('zlove_posts');
var bcrypt = require('bcrypt');
var city = require('../../libs/city');
var crypto = require('crypto');
var path = require('path');
let multer 	= require('multer');
var storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: function (req, file, cb) {
	  crypto.pseudoRandomBytes(16, function (err, raw) {
		if (err) return cb(err);

		cb(null, raw.toString('hex') + path.extname(file.originalname));
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
		}).sort({ Username: 1});
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
			else{
				user.findOne({_id: id}).remove(function(){
					res.sendStatus(200);
					return;
				});
			}
		});
		// user.find({_id: id}).remove(function(){
		// 	res.sendStatus(200);
		// 	return;
		// });
	}


	if (_option == 'getUserByID'){
		var id 		= req.body.id;
		console.log(id);
		user.find({_id: id}, function(err, result){
			if (err) throw err;
			if (!result){
				res.sendStatus(404);
				return;
			}else{
				res.send(result);
				return;
			}
		});
	}

	if (_option == 'removeAvatar'){
		var userId = req.body.id;
		user.findOne({_id: userId}, function(err, result){
			if (err) throw err;
			if (!result){
				res.send('Not found this user');
			}
			else{
				var path = result.Avatar;
				if(path != ''){
					fs.unlink(path, function(err){
						if (err){
							console.log(err);
						}
						console.log('Deleted file');
						user.updateOne({_id: userId}, {
							Avatar: ''
						}, function(err, result){
							if (err) throw err;
							res.send('success');
						});
					});
				}
			}
		});
	}
});

router.post('/add', upload.single('avatar'), function(req, res, next){
	var avatar 		= req.file;
	var data 		= req.body;

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
					"Working" : data.job,
					"WorkingAt" : data.workingat,
					"Relationship" : data.relationship,
					"Phone" : data.phone,
					"Facebook" : data.facebook,
					"Skype" : data.skype,
					"Introduction" : data.introduction,
					"PlaceOfBirth" : data.birthplace,
					"CreatedDate" : createdDate,
					"Avatar" : path,
					"SocketID" : '',
		            "Online" : 0,
		            "Setting" :{
		              "isHiddenBirthday" : 0,
		              "isHiddenPlaceOfBirth" : 0,
		              "isHiddenCurrentPlace" : 0
		            },
					"Status" : data.status
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
					"Working" : data.job,
					"WorkingAt" : data.workingat,
					"Relationship" : data.relationship,
					"Phone" : data.phone,
					"Facebook" : data.facebook,
					"Skype" : data.skype,
					"Introduction" : data.introduction,
					"PlaceOfBirth" : data.birthplace,
					"CreatedDate" : createdDate,
					"Avatar" : '',
					"SocketID" : '',
		            "Online" : 0,
		            "Setting" :{
		              "isHiddenBirthday" : 0,
		              "isHiddenPlaceOfBirth" : 0,
		              "isHiddenCurrentPlace" : 0
		            },
					"Status" : data.status
				});

				newUser.save(function(err, result){
					if (err) throw err;
					if(result._id){

					}
					else{
						res.sendStatus(501);
					}
				});
			});
		});
	}
});

router.post('/edit-user', upload.single('avatar'), function(req, res, next){
	var avatar 		= req.file;
	var data 		= req.body;

	var id 			= data.id;

	if (avatar){
		var path 		= avatar.path;

		user.updateOne({_id: id}, {
			"Username" : data.username,
			"Email" : data.email,
			"DateOfBirth" : data.birthday,
			"CurrentPlace" : data.city,
			"FirstName" : data.firstname,
			"LastName" : data.lastname,
			"Gender" : data.gender,
			"Working" : data.job,
			"WorkingAt" : data.workingat,
			"Relationship" : data.relationship,
			"Phone" : data.phone,
			"Facebook" : data.facebook,
			"Skype" : data.skype,
			"Introduction" : data.introduction,
			"PlaceOfBirth" : data.birthplace,
			"Avatar" : path,
			"Status" : data.status
		}, function(err, result){
			if (err) throw err;
			res.sendStatus(200);
		});
	}
	else{

		user.updateOne({_id: id}, {
			"Username" : data.username,
			"Email" : data.email,
			"DateOfBirth" : data.birthday,
			"CurrentPlace" : data.city,
			"FirstName" : data.firstname,
			"LastName" : data.lastname,
			"Gender" : data.gender,
			"Working" : data.job,
			"WorkingAt" : data.workingat,
			"Relationship" : data.relationship,
			"Phone" : data.phone,
			"Facebook" : data.facebook,
			"Skype" : data.skype,
			"Introduction" : data.introduction,
			"PlaceOfBirth" : data.birthplace,
			"Status" : data.status
		}, function(err, result){
			if (err) throw err;
			res.sendStatus(200);
		});
	}
});

router.get('/getusername', function(req, res, next){
	try {
		user.aggregate([
			{$sort: {
					Username: 1
				}
			},
			{$project: {
					_id: 0,
					User: "$Username"
				}
			}
		]).exec(function(err, data){
			res.send(data);
		});
	} catch (error) {
		console.log('ERROR@AJAX-ADMIN:getusername: '+error);
		res.status(500).send('Server Error');
	}
});

router.post('/post', async function(req, res, next){
	var option = req.body.option;

	if (option == 'fetchPostsPending'){
		try {
			var arrData = [];
			let data = await post.find({Status: 0}).sort({created_at: -1}).exec();
			for (var i = 0; i<data.length; i++){
				var id = data[i]._id;
				var Title =  data[i].Title;
				var Target = data[i].Target;
				var FromAge = data[i].FromAge;
				var ToAge = data[i].ToAge;
				var City = data[i].City;
				var Job = data[i].Job;
				var Description = data[i].Description;
				var CreatedDate = data[i].CreatedDate;
				var CreatedByID = data[i].CreatedBy;
				var EditedDate = data[i].EditedDate;
				var View = data[i].View;
				var NumberApply = data[i].NumberApply;
				var Status =  data[i].Status;
				let data2 = await user.findOne({_id: CreatedByID});
				var CreatedBy = data2.Username;
				arrData.push({
					_id: id,
					Title: Title,
					Target: Target,
					FromAge: FromAge,
					ToAge: ToAge,
					City: City,
					Job: Job,
					Description: Description,
					CreatedBy: CreatedBy,
					EditedDate: EditedDate,
					CreatedDate: CreatedDate,
					View: View,
					NumberApply: NumberApply,
					Status: Status
				});
			}
			res.send(arrData);
		} catch (error) {
			console.log('ERROR@AJAX_ADMIN:POST: '+error);
			res.status(500).send('Server Error');
		}
	}
});
