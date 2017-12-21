

$(document).ready(function(){
    
    
    
    {
        var noti = io.connect('http://localhost:8080/noti');
    
        noti.on('connection', function(){
            console.log('Connected to notification server');
        });
    }
});