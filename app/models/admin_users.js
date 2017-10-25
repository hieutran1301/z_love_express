var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');


var userSchema = mongoose.Schema({

    username    : String,
    email       : String,
    password    : String,
    status      : Number

});


userSchema.methods.validPassword = function(password) {
	console.log("hash: "+this.password);
	console.log("plain pass: "+password);

    return bcrypt.compareSync(password, this.password);
};


mongoose.model('Admins', userSchema);