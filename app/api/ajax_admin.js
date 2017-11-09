var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');

var user = mongoose.model('zlove_users');
var city = require('../../libs/city');

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
		user.find({_id: id}).remove(function(){
			res.sendStatus(200);
			return;
		});
	}
});