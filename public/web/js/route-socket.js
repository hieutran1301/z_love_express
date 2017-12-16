var _path    = window.location.pathname;
var _arrpath = _path.split('/');
var _target  = _arrpath[3];
var _messengerPage = _arrpath[2];

var renderReceiveHTML = function(string){
    var headHTML =  '<div class="receive">'+
                    '<img src="/web/images/avatar.jpg">'+
                    '<p>';

    var footHTML =  '</p></div>';
    return headHTML+string+footHTML;
}

var renderSentHTML = function(string){
    var topHTML =   '<div class="send">'+
                    '<img src="/web/images/avatar.jpg">'+
                    '<p>';
    var bottomHTML = '</p></div>';
    return topHTML+string+bottomHTML;
}

$(document).ready(function(){
    {
        var mess = io.connect('http://localhost:8080/chat');
        mess.on('connection', function(){
            console.log('Connected to messenger server');
        });

        var messages = null;
    
        var btnSend     = $('#btnSendMess');
        var inpMess     = $('input[name=inp-input-messenger]');
        var messBlock   = $('#chatContent');

        mess.on('resNewMess', function(data){
            var from = data.from;
            var theMessage = data.mess;

            if (_messengerPage != null && _messengerPage != undefined){
                if (_target === from){
                    // alert(theMessage);
                    messBlock.append(renderReceiveHTML(theMessage));
                    $('#chatContentWrap').animate({scrollTop: $('#chatContentWrap')[0].scrollHeight}, 2000);
                } else{
                    //do something
                }
            }
            else{
                //do something
            }
        });
        
        var socket_sendMess = function(message, target){
            if (target != null && target != '' && target != undefined){
                var data = {
                    username: target,
                    data    : message
                }
                mess.emit('newMessage', data);
            } 
            else{
                return;
            }
        }
    
        btnSend.click(function(){
            var inpText     = inpMess.val();
            if (inpText != '' && inpText != null){
                messBlock.append(renderSentHTML(inpText));
                $('#chatContentWrap').animate({scrollTop: $('#chatContentWrap')[0].scrollHeight}, 2000);
                inpText = addSlashes(inpText);
                socket_sendMess(inpText, _target);
            }
            else{
                return;
            }
        });
    }
    
    
    {
        var noti = io.connect('http://localhost:8080/noti');
    
        noti.on('connection', function(){
            console.log('Connected to notification server');
        });
    }
});