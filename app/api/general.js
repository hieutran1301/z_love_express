var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');

var user = mongoose.model('zlove_users');

module.exports = function (app, passport) {
  app.use('/app-api', router);
};

router.get('/exist/:username', async (req, res, next) => {
	let username = req.params.username;
	try {
		let query = await user.findOne({Username: username});
		if (query) { res.send("Username is unavailable!") }
		else{
			res.status(404).send("Username is available!");
		}
	} catch (err) {
		console.log(err);
		res.sendStatus(404);
	}
});