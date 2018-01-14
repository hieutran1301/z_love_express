var mongoose = require('mongoose');

var messageShema = mongoose.Schema({
    PostID: String,
    ApplyBy: String
}, { timestamps: { createdAt: 'created_at' } });

mongoose.model('zlove_applies', messageShema);