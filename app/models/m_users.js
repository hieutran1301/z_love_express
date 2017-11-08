var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');


var usersSchema = mongoose.Schema({

    "Username" : String,
    "Password" : String,
    "Email" : String,
    "DateOfBirth" : String,
    "CurrentPlace" : String,
    "FirstName" : String,
    "LastName" : String,
    "Gender" : Number,
    "Working" : String,
    "Phone" : String,
    "Facebook" : String,
    "Skype" : String,
    "Introduction" : String,
    "PlaceOfBirth" : String,
    "CreatedDate" : String,
    "Avatar" : String,
    "Status" : Number

});




usersSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


mongoose.model('zlove_users', usersSchema);