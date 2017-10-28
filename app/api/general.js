var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');

var user = mongoose.model('user1');

module.exports = function (app, passport) {
  app.use('/adminapi', router);
};

router.get('/users', function(req, res){
	user.find(function(err, data){
		if (err) {
			throw err;
		}
		if (!data) {
			res.send(404);
			return;
		}
		else{
			res.send({
				data: data
			});
			return;
		}
	});
});

router.get('/users/:id', function(req, res){
	var userId = req.params.id;
	user.findOne({
		_id: userId
	}, function(err, data){
		if (err) {res.send(404); return;}
		if (!data) {
			res.send(404);
			return;
		}
		else{
			res.send(data);
			return;
		}
	});
});