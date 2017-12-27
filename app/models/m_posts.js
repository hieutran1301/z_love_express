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
  "View"        : Number,
  "NumberApply" : Number,
  "Status"      : Number

}, { timestamps: { createdAt: 'created_at' } });


mongoose.model('zlove_posts', postsSchema);
