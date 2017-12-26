var AJAX_PATH = '../../../ajax-home/checkusername';


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


});

function checkUsername(username) {
  $.post(AJAX_PATH, {
    username: username,
  }, function (data) {
    if(data == 'Success'){
      $('#username').removeClass('input-red');
    }else {
      swal('Oops!','Tên đăng nhập đã được sử dụng','warning');
      $('#Username').val('');
    }
  });
};
