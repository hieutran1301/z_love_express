var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');


var userdata = mongoose.Schema({

    username    : String,
    password    : String

});




userdata.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


mongoose.model('user1', userdata);