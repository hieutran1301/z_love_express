var mongoose = require('mongoose');
var user     = mongoose.model('zlove_users');


module.exports = function(io){
    io.of('/chat')
    .on('connection', function(socket){
        // console.log(socket.id);

        socket.on('updatedb', (data) => {
            console.log('id: '+data);
            console.log('socketid: '+socket.id);
            updateDb(socket.id, data);
        });

        socket.on('disconnect', ()=>{
            user.updateOne({SocketID: socket.id}, {
                SocketID: "",
                Online: 0
            }, function(err, result){
                if (err) throw err;
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
    });
}