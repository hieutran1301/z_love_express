var AJAX_USERS_PATH = '../../../../../ajax-admin/';
var _city = '';

var checkbox = '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">'+
                    '<input type="checkbox" class="checkboxes" value="1" />'+
                    '<span></span>'+
                '</label>';


function removeUser(obj){
    var id = $(obj).parents('tr').attr('id');
    if (confirm("Do you want to remove this user?")) {
        $.post(AJAX_USERS_PATH,
            {
                option: 'removeUser',
                id: id
            },
            function (msg) {
                if (msg == 'OK') {
                    alert('Success');
                    var usertable = $('#users_tables');
                    getUsers(usertable);
                }
                else{
                    alert('Something went wrong, try again');
                }
            }
        );
    }
}

function openModal(obj){
    var option      = $(obj).attr('data-option');
    var modalID     = $(obj).attr('data-modal');
    var modal       = $('#'+modalID);

    if (option == 1) { //Add new
        var modalTitle = 'Add new user';
        modal.find('.modal-title').html(modalTitle);
        modal.find('.city').html(_city);
        showModal(modalID);
    }
    else{ //Edit user
        var modalTitle = 'Edit user';

    }
}

$(document).ready(function(){
    var usertable = $('#users_tables');
    getUsers(usertable);
    getCities();
});


function getUsers(table){
    $.post(AJAX_USERS_PATH,
        {
            option  : 'getUsers'
        },
        function(data){
            var html = '';
            for (var i = 0; i < data.length; i++) {
                if (data[i].Status == 1) {
                    var status = '<span class="label label-sm label-success"> Active </span>';
                }
                else{
                    var status = '<span class="label label-sm label-default"> Inactive </span>'
                }
                var action =    '<a href="javascript:;" class="btn btn-xs blue">Edit <i class="fa fa-edit"></i></a>'+
                                '<a href="javascript:;" class="btn btn-xs red" onclick="removeUser(this)">Delete <i class="fa fa-remove"></i></a>';
                html += '<tr class="odd" id="'+data[i]._id+'">'+
                        '<td>'+checkbox+'</td>'+
                        '<td>'+data[i].Username+'</td>'+
                        '<td>'+data[i].Email+'</td>'+
                        '<td>'+status+'</td>'+
                        '<td>'+data[i].CreatedDate+'</td>'+
                        '<td>'+action+'</td>'+
                        '</tr>';
            }
            $(table).find('tbody').html(html);
            pagination();
        }   
    );
}

function getCities(){
    var html = '';
    $.get(AJAX_USERS_PATH+'cities',{}, function(data){
        for (var i=0; i<data.length; i++){
            html+= '<option value="'+(i+1)+'">'+data[i]+'</option>';
        }
        _city = html;
    });
}

function addUser(){
    var form     = $('#formUser')[0];
    var formData = new FormData(form);

    formData.append('option', 'addUser');
    
    $.ajax({
        url: AJAX_USERS_PATH,
        data: formData,
        type: 'POST',
        contentType: false,
        processData: false,
        success: function(data){
            alert(data);
        }
    });
}