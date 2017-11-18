var bcrypt = require('bcrypt');
var saltRounds = 8;
var myPlaintextPassword = '123123';

bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        console.log(hash);
    });
});