var AJAX_POST_PATH = '../../../../../ajax-admin/post';


var checkbox = '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">'+
                '<input type="checkbox" class="checkboxes" value="1" />'+
                '<span></span>'+
                '</label>';

var _city = '';
var _username;

$(document).ready(function(){
    getPostsPending('#posts_tables');
    getCities();
    getusername();
});

function getPostsPending(table){
    $.post(AJAX_POST_PATH,
        {
            option  : 'fetchPostsPending'
        },
        function(data){
            var html = '';
            for (var i = 0; i < data.length; i++) {
                if (data[i].Status == 0) {
                    var status = '<span class="label label-sm label-warning"> Pending </span>';
                }
                else{
                    var status = '<span class="label label-sm label-success"> Active </span>'
                }
                var action =    '<a href="javascript:;" class="btn btn-xs blue" data-user="'+data[i]._id+'" data-option="0" onclick="openModal(this)" data-modal="modal_Post">Edit <i class="fa fa-edit"></i></a>'+
                                '<a href="javascript:;" class="btn btn-xs red" onclick="removeUser(this)">Delete <i class="fa fa-remove"></i></a>';
                html += '<tr data-search="true" class="odd" id="'+data[i]._id+'">'+
                        '<td>'+checkbox+'</td>'+
                        '<td>'+data[i].Title+'</td>'+
                        '<td>'+data[i].View+'</td>'+
                        '<td>'+status+'</td>'+
                        '<td>'+data[i].CreatedDate+'</td>'+
                        '<td>'+data[i].CreatedBy+'</td>'+
                        '<td>'+action+'</td>'+
                        '</tr>';
            }
            $(table).find('tbody').html(html);
            pagination();
            hideLoading();
        }   
    );
}

function openModal(obj){
    var option      = $(obj).attr('data-option');
    var modalID     = $(obj).attr('data-modal');
    var modal       = $('#'+modalID);

    if (option == 0){ //Add new
        var modalTitle = 'Add new post';
        modal.find('.city').html(_city);
        showModal(modalID);
    }
}

function getCities(){
    var html = '';
    $.get('../../../../../ajax-admin/cities',{}, function(data){
        for (var i=0; i<data.length; i++){
            html+= '<option value="'+(i+1)+'">'+data[i]+'</option>';
        }
        _city = html;
    });
}

function getusername(){
    $.get('../../../../../ajax-admin/getusername', {}, function(data){
        alert(data);
        var arr = [];
        for (var i = 0; i < data.length; i++){
            arr.push(data[i].User);
        }
        _username = arr;
        $('#inpUsername').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
          },
          {
            name: 'username',
            source: substringMatcher(_username)
          });
    });
}

var substringMatcher = function(strs) {
    return function findMatches(q, cb) {
      var matches, substringRegex;
  
      // an array that will be populated with substring matches
      matches = [];
  
      // regex used to determine if a string contains the substring `q`
      substrRegex = new RegExp(q, 'i');
  
      // iterate through the pool of strings and for any string that
      // contains the substring `q`, add it to the `matches` array
      $.each(strs, function(i, str) {
        if (substrRegex.test(str)) {
          matches.push(str);
        }
      });
  
      cb(matches);
    };
  };