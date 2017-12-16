var mongoose = require('mongoose');

var messageShema = mongoose.Schema({
    "FromID"    : String,
    "ToID"      : String,
    "Content"   : String,
    "Timestamp" : String
});

mongoose.model('zlove_messages', messageShema);