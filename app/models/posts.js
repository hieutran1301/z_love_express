var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');



var postsSchema = mongoose.Schema({

  "Title"   : String,
  "Target"  : Number,
  "FromAge" : Number,
  "ToAge"   : Number,
  "City"    : Number,
  "Job"     : Number,
  "Description" : String,
  "CreatedDate" : String,
  "CreatedBy"   : String,
  "EditedDate"  : String,
  "Wiew"        : Number,
  "NumberApply" : Number,
  "Status"      : Number

});


mongoose.model('zlove_posts', postsSchema);
