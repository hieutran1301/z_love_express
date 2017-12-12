var month30 = [4,6,9,11];
var month31 = [1,3,5,7,8,10,12];
var AJAX_PATH = '../../../ajax-home/checkusername';
var AJAX_PATH_MAIL = '../../../ajax-home/checkemail';

function FillDay()
{
    var day = document.getElementById('Day');
    var month = document.getElementById('Month');
    var year = document.getElementById('Year');
    for (var i = 1; i < 32 ; i++) {
        day.innerHTML = day.innerHTML + '<option value='+i+'>'+i+'</option>';
    }
    for (var i = 1; i < 13 ; i++) {
        month.innerHTML = month.innerHTML + '<option value='+i+'>'+i+'</option>';
    }
    for (var i = 2000; i > 1969 ; i--) {
        year.innerHTML = year.innerHTML + '<option value='+i+'>'+i+'</option>';
    }
}


$(document).ready(function () {
  var csrf = $('input[name=_csrf]').val();
  if (csrf != null || csrf != undefined) {
    $.ajaxSetup({
      headers: {'X-CSRF-Token': csrf}
    });
  }

  $('input[name=username]').focusout(function () {
    var username = $(this).val();
    checkUsername(username);
  });

  $('input[name=email]').focusout(function () {
    var email = $(this).val();
    checkEmail(email);
  })
});

$( "#button" ).click(function() {
    if(checkNull() != 0){
      $('#FormSignup').submit();
    }
});

$('#FirstName').keyup(function () {
  checkNull();
});

$('#LastName').keyup(function () {
  checkNull();
});

$('#Sex').select(function () {
  checkNull();
});

$('#Work').keyup(function () {
  checkNull();
});

$('#Day').select(function () {
  checkNull();
});

$('#Month').select(function () {
  checkNull();
});

$('#Year').select(function () {
  checkNull();
});

$('#Local').keyup(function () {
  checkNull();
});

$('#Arrive').select(function () {
  checkNull();
});

$('#Email').keyup(function () {
  checkNull();
});

$('#userName').keyup(function () {
  checkNull();
});

$('#pass').keyup(function () {
  checkNull();
});

$('#re-pass').keyup(function () {
  checkPass();
});

$('#re-pass').focusout(function () {
  checkPass();
});

function checkUsername(username) {
    $.post(AJAX_PATH, {
      username: username,
    }, function (data) {
      if(data == 'Success'){
        $('#username').removeClass('input-red');
      }else {
        swal('Oops!','Tên đăng nhập đã được sử dụng','warning');
        $('#userName').val('');
      }
    });
};

function checkEmail(email) {
    $.post(AJAX_PATH_MAIL, {
      email: email,
    },function (data) {
      if(data == 'emailSuccess'){

      }else {
        swal('Oops!', 'Email đã được sử dụng', 'warning');
        $('#Email').val('');
      }
      });
}



function checkNull() {
  var firstname = $('#FirstName').val();
  var lastname  = $('#LastName').val();
  var sex       = $('#Sex').val();
  var work      = $('#Work').val();
  var day       = $('#Day').val();
  var month     = $('#Month').val();
  var year      = $('#Year').val();
  var local     = $('#Local').val();
  var email     = $('#Email').val();
  var username  = $('#userName').val();
  var pass      = $('#pass').val();
  var repass    = $('#re-pass').val();
  var lag;

  if(firstname == '' | firstname == null){
    $('#FirstName').addClass('input-red');
    lag = 0;
  }else {
    $('#FirstName').removeClass('input-red');
  }

  if(lastname == '' | lastname == null){
    $('#LastName').addClass('input-red');
    lag = 0;
  }else {
    $('#LastName').removeClass('input-red');
  }

  if(sex == '' | sex == null | sex == 0){
    $('#Sex').addClass('input-red');
    lag = 0;
  }else {
    $('#Sex').removeClass('input-red');
  }

  if(work == '' | work == null){
    $('#Work').addClass('input-red');
    lag = 0;
  }else {
    $('#Work').removeClass('input-red');
  }

  if(day == '' | day == null | day == 0){
    $('#Day').addClass('input-red');
    lag = 0;
  }else {
    $('#Day').removeClass('input-red');
  }

  if(month == '' | month == null | month == 0){
    $('#Month').addClass('input-red');
    lag = 0;
  }else {
    $('#Month').removeClass('input-red');
  }

  if(year == '' | year == null | year == 0){
    $('#Year').addClass('input-red');
    lag = 0;
  }else {
    $('#Year').removeClass('input-red');
  }

  if(local == '' | local == null ){
    $('#Local').addClass('input-red');
    lag = 0;
  }else {
    $('#Local').removeClass('input-red');
  }


  if(email == '' | email == null){
    $('#Email').addClass('input-red');
    lag = 0;
  }else {
    $('#Email').removeClass('input-red');
  }

  if(username == '' | username == null){
    $('#userName').addClass('input-red');
    lag = 0;
  }else {
    $('#userName').removeClass('input-red');
  }

  if(pass == '' | pass == null){
    $('#pass').addClass('input-red');
    $('#re-pass').addClass('input-red');
    lag = 0;
  }else {
    $('#pass').removeClass('input-red');
    $('#re-pass').removeClass('input-red');
  }

  return lag;
}


function checkPass() {
  var pass   = $('#pass').val();
  var repass = $('#re-pass').val();
  if(pass != repass){
    $('#re-pass').addClass('input-red');
  }else {
    $('#re-pass').removeClass('input-red');
  }
}
