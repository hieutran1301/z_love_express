module.exports = function(io){
    io.of('/notification')
    .on('connection', function(socket){
        console.log(socket.id);
    });
}