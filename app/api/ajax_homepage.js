var express = require('express'),
router = express.Router(),
mongoose = require('mongoose');

var user = mongoose.model('zlove_users');

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