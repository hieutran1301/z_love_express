var mongoose = require('mongoose');
var user     = mongoose.model('zlove_users');
var express  = require('express');

module.exports = function(io, uid){
    io.of('/chat')
    .on('connection', function(socket){
        var userID = socket.handshake.session.homeuserid;
        console.log("New socket connected: "+socket.id);
        console.log('User id from session: '+socket.handshake.session.homeuserid);
        
        if (userID != null && userID != undefined) updateDb(socket.id, userID);

        socket.on('disconnect', function(){
            console.log(socket.id+' disconnected');
            user.updateOne({SocketID: socket.id}, {
                SocketID: "",
                Online: 0
            }, function(err, result){
                if (err) throw err;
                console.log('delete socket id done');
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
        console.log('Update done');
    });
}