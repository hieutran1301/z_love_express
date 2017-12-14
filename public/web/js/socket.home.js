var socket = io.connect('http://localhost:8080/chat');

socket.on('connection', function(){
    console.log('connected to server');
});

socket.on('tx', function(data){
    alert(data);
});

socket.on('auth', function(data){
    socket.emit('updatedb', data);
});