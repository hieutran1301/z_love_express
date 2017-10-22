var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');


var userSchema = mongoose.Schema({

    username    : String,
    password    : String

});


userSchema.methods.genereHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


module.exports = mongoose.model('web_user', userSchema);