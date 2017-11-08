var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');

var user = mongoose.model('zlove_users');

module.exports = function (app, passport) {
  app.use('/ajax-admin', router);
};

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
});