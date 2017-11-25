var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');
var cities   = require('../../libs/city');


var usersSchema = mongoose.Schema({

    "Username" : String,
    "Password" : String,
    "Email" : String,
    "DateOfBirth" : String,
    "CurrentPlace" : String,
    "FirstName" : String,
    "LastName" : String,
    "Gender" : Number,
    "Working" : Number,
    "WorkingAt" : String,
    "Relationship": Number,
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
    return bcrypt.compareSync(password, this.Password);
};

usersSchema.methods.getAge = function(){
    var age;

    var bd  = this.DateOfBirth;
    bd      = bd.split('/');

    var crrDate = new Date();
    var crrDay  = crrDate.getDate();
    var crrMon  = crrDate.getMonth()+1;
    var crrY    = crrDate.getFullYear();

    if (bd[1]*1 > crrMon) return age = Math.abs((crrY - bd[2]*1)+1);
    if (bd[1]*1 < crrMon) return age = Math.abs(crrY - bd[2]*1);
    if (bd[1]*1 == crrMon) {
        if (bd[0]*1 >= crrDate) {return age = Math.abs((crrY - bd[2]*1)+1)}
        else return age = Math.abs(crrY - bd[2]*1);
    }
};

usersSchema.methods.getCity = function(idx){
    return cities[idx-1];
}

usersSchema.methods.getGender = function(){
    if (this.Gender == 1) {return "Nam"}
    else return "Nữ";
}

usersSchema.methods.getAvatar = function(){
    var dir = this.Avatar;
    dir     = dir.split('\\');
    return '../../uploads/'+dir[2];
}

usersSchema.methods.getWorking = function(){
    if(this.Working == 0){
        return "Sinh viên";
    }
    if(this.Working == 1){
        return "Đang đi làm";
    }
    if(this.Working == 2){
        return "Đang tìm việc";
    }
}


mongoose.model('zlove_users', usersSchema);