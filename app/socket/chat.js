var mongoose = require('mongoose');
var user     = mongoose.model('zlove_users');
var modelMess= mongoose.model('zlove_messages');
var express  = require('express');

module.exports = function(io, uid){

    io.of('/chat')
    .on('connection', function(socket){
        var userID = socket.handshake.session.homeuserid;
        var socketID = socket.id;
        // console.log("New socket connected: "+socket.id);
        // console.log('User id from session: '+socket.handshake.session.homeuserid);
        
        if (userID != null && userID != undefined) updateDb(socket.id, userID);

        socket.on('disconnect', function(){
            //console.log(socket.id+' disconnected');
            user.updateOne({SocketID: socket.id}, {
                SocketID: "",
                Online: 0
            }, function(err, result){
                if (err) throw err;
                //console.log('delete socket id done');
            });
        });

        //============ Chatting

        socket.on('newMessage', function(data){
            var username = data.username;
            var mess     = addSlashes(data.data);
            console.log(mess);

            console.log('new message from '+userID+' to '+data.username+' with message: '+mess);
            user.findOne({Username: username}, function(err, result){ // Get info of Receiver
                if (err) throw err;
                if (result) {
                    var usrReceiveSocketID = result.SocketID; //Receiver SocketID@user
                    var usrReceiveID       = result._id;      //Receiver _id@user

                    user.findOne({SocketID: socketID}, function(err, usrSending){
                        if (err) throw err;
                        if (usrSending){
                            var usrSendingUsername = usrSending.Username;   //Sender Username@user
                            var usrSendingID       = usrSending._id;        //Sender _id@user
                            var usrSendingAvatar   = usrSending.getAvatar();
                            console.log(usrSendingAvatar);

                            // Saving to database

                            var now  = new Date();
                            var Timestamp = ''+addZero(now.getHours())+':'+addZero(now.getMinutes())+':'+addZero(now.getSeconds())+' '+now.getDate()+'/'+(now.getMonth()+1)+'/'+now.getFullYear(); 

                            var newMessage = new modelMess({
                                "FromID"    : usrSendingID,
                                "ToID"      : usrReceiveID,
                                "Content"   : mess,
                                "Timestamp" : Timestamp
                            });

                            newMessage.save(function(err, svResult){
                                if (err) throw err;
                                if (svResult._id){
                                    var sendingData = {
                                        from: usrSendingUsername,
                                        mess: mess
                                    }
                                    socket.to(usrReceiveSocketID).emit('resNewMess', sendingData); //Emit to Receiver via Socket ID
                                    socket.emit('saveData', 'success');
                                }
                            });

                            // End of Saving

                        }
                    });

                }
            });
        });

    });
}

function updateDb(socketid, userid){
    user.updateOne({_id: userid}, {
        SocketID: socketid,
        Online: 1
    }, function(err, result){
        if (err) throw err;
        //console.log('Update done');
    });
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

var addSlashes = function(string){
	return string.replace(/\\/g, '\\\\').
				replace(/\u0008/g, '\\b').
				replace(/\t/g, '\\t').
				replace(/\n/g, '\\n').
				replace(/\f/g, '\\f').
				replace(/\r/g, '\\r').
				replace(/'/g, '\\\'').
				replace(/"/g, '\\"').
				replace(/\</g,"&lt;").
				replace(/\>/g,"&gt;");
}