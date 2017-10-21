var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');


var userSchema = mongoose.Schema({

    username    : String,
    email       : String,
    password    : String,
    status      : String

});


userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


module.exports = mongoose.model('Admins', userSchema);