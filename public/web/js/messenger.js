var AJAX_MESS_PATH = '../../../ajax-home/messenger';

var csrf = $('input[name=_csrf]').val();
if (csrf != null || csrf != undefined) {
	$.ajaxSetup({
		headers: {'X-CSRF-Token': csrf}
	});
}

var now  = new Date();
var Timestamp = ''+addZero(now.getHours())+':'+addZero(now.getMinutes())+':'+addZero(now.getSeconds())+' '+now.getDate()+'/'+(now.getMonth()+1)+'/'+now.getFullYear(); 

var _path    = window.location.pathname;
var _arrpath = _path.split('/');
var _target  = _arrpath[3];
var _messengerPage = _arrpath[2];

var renderReceiveHTML = function(string, time, avatar){
    var headHTML =  '<div class="receive">'+
                    '<img src="'+avatar+'">'+
                    '<p>';

    var footHTML =  '</p>'+
                    '<div class="seen" style="display:none">'+
                    '<p>'+time+'</p>'+
                    '</div>'+
                    '</div>';
    return headHTML+string+footHTML;
}

var renderSentHTML = function(string, time, avatar){
    var topHTML =   '<div class="send">'+
                    '<img src="/web/images/avatar.jpg">'+
                    '<p>';
    var bottomHTML =    '</p>'+
                        '<div class="seen" style="display:none">'+
                        '<p>'+time+'</p>'+
                        '</div>'+
                        '</div>';
    return topHTML+string+bottomHTML;
}

var renderChatUserHTML = function(username, avatarpath, content){
    var href = './'+username;
    var avatarpath = avatarpath.split('\\');
    var avatar = avatarpath[2];
    var HTML =  '<div class="chat-users">'+
                '<a href="'+href+'">'+
                    '<div class="row">'+
                        '<div class="col-xs-2 col-sm-3 col-md-3 avatar">'+
                            '<img src="/uploads/'+avatar+'">'+
                        '</div>'+
                        '<div class="col-xs-10 col-sm-9 col-md-9">'+
                        '<div class="user-name">'+username+'</div>'+
                        '<div class="user-content">'+content+'</div>'+
                    '</div></div></a></div>';
    return HTML;
}

var renderPreLoadList = function(){
    var DomHTML =   '<div id="ListChat" class="listchat">'+
                        '<div id="preLoadList">'+
                            '<div class="ico-loading"><img src="/admin/assets/apps/img/Rolling.gif" alt=""></div>'+
                        '</div>'+
                    '</div>';
}

var __messages = null;
var __HTMLmessages = '';

var getMess = function() {
    var _targetID = $('input[name=targetID]').val();
    var messBlock   = $('#chatContent');
    $.post(AJAX_MESS_PATH, {
        targetID: _targetID,
        option: "getMess"
    }, function(data){
        __messages = data;
        alert(__messages);
        // for(var i = 0; i < __messages.length; i++){
        //     if (__messages[i].FromID == _targetID){
        //         __HTMLmessages += renderReceiveHTML(__messages[i].Content, __messages[i].Timestamp);
        //     }
        //     else{
        //         __HTMLmessages += renderSentHTML(__messages[i].Content, __messages[i].Timestamp);
        //     }
        // }
        // $('#ChatContent #preLoadMess').fadeOut();
        // messBlock.html(__HTMLmessages);
        // $('#chatContentWrap').animate({scrollTop: $('#chatContentWrap')[0].scrollHeight}, 500);

        // //UX - click show info
        // $('div.send').each(function(){
        //     var divSend = $(this);
        //     divSend.click(function(){
        //         var divSendClick = $(this);
        //         divSendClick.find('.seen').toggle();
        //     });
        // });
        // $('div.receive').each(function(){
        //     var divSend = $(this);
        //     divSend.click(function(){
        //         var divSendClick = $(this);
        //         divSendClick.find('.seen').toggle();
        //     });
        // });
    });
}

var getPerson = function(){
    var domhtml = '';
    var listChat = $('#ListChat');
    $.post(AJAX_MESS_PATH, {
            option: 'getPerson',
        }, function(data, success){
            if (success == 'success'){
                for (var i = 0; i < data.length; i++){
                    domhtml += renderChatUserHTML(data[i].Username, data[i].Avatar, reduceWord(data[i].Content, 32));
                }
                $('#preLoadList').fadeOut();
                listChat.html(domhtml);
            }
            else{
                swal('Error', 'Có gì đó sai sai vừa xảy ra, thử lại nhé!', 'error');
            }
        }
    );
}

$(document).ready(function(){
    getMess();
    getPerson();
    //messenger socket
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
            var from        = data.from;
            var theMessage  = data.mess;
            var avatar      = data.ava;
            var time        = data.time;

            if (_messengerPage != null && _messengerPage != undefined){
                if (_target === from){
                    // alert(theMessage);
                    messBlock.append(renderReceiveHTML(theMessage, time, avatar));
                    $('#chatContentWrap').animate({scrollTop: $('#chatContentWrap')[0].scrollHeight}, 2000);
                } else{
                    //do something
                }
            }
            else{
                //do something
            }
        });

        mess.on('saveData', function(data){
            if (data == 'success') {
                getPerson();
                console.logo('get person');
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
        
        // Send message
        btnSend.click(function(){
            var inpText     = inpMess.val();
            if (inpText != '' && inpText != null){
                socket_sendMess(inpText, _target);
                inpText = addSlashes(inpText);
                messBlock.append(renderSentHTML(inpText, Timestamp));
                $('#chatContentWrap').animate({scrollTop: $('#chatContentWrap')[0].scrollHeight}, 500);
                inpMess.val('').focus();
            }
            else{
                return;
            }
        });

        //Trigger send message when hitting enter
        inpMess.keypress(function(e){
            if (e.which == 13) {
                btnSend.trigger('click');
            }
        });

        $('div.send').each(function(){
            var divSend = $(this);
            divSend.click(function(){
                var divSendClick = $(this);
                divSendClick.find('.seen').toggle();
            });
        });
        $('div.receive').each(function(){
            var divSend = $(this);
            divSend.click(function(){
                var divSendClick = $(this);
                divSendClick.find('.seen').toggle();
            });
        });
    }
});

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}