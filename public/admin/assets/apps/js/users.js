var AJAX_USERS_PATH         = '../../../../../ajax-admin/';
var AJAX_ADD_USERS_PATH     = AJAX_USERS_PATH+'add';
var AJAX_EDIT_USERS_PATH    = AJAX_USERS_PATH+'edit-user';
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
        window.localStorage.setItem('edtUserId', '');
        var modalTitle = 'Add new user';
        modal.find('.modal-title').html(modalTitle);
        modal.find('.city').html(_city);
        $('#btnEditUser').addClass('hidden');
        $('#btnAddUser').removeClass('hidden');
        $('#cancelUpload').removeClass('hidden');
        $('#removeAvatar').addClass('hidden');
        dragAndDrop.show();
        dragDropPrv.hide();
        resetForm('formUser');
        showModal(modalID);
    }
    else{ //Edit user
        var modalTitle  = 'Edit user';
        var userID      = $(obj).attr('data-user');
        $.post(AJAX_USERS_PATH, 
            {
                option  : 'getUserByID',
                id      : userID
            }, 
            function(data){
                window.localStorage.setItem('edtUserId', userID);
                data        = data[0];
                $('.city').html(_city);
                var id          = data._id;
                var username    = data.Username;
                var pass        = data.Password;
                var email       = data.Email;
                var birthday    = data.DateOfBirth;
                var currPlace   = data.CurrentPlace;
                var firstName   = data.FirstName;
                var lastName    = data.LastName;
                var gender      = data.Gender;
                var working     = data.Working;
                var phone       = data.Phone;
                var facebook    = data.Facebook;
                var skype       = data.Skype;
                var intro       = data.Introduction;
                var birthPlace  = data.PlaceOfBirth;
                var avatar      = data.Avatar;

                $('input[name=username]').val(username);
                $('input[name=password]').val(pass);
                $('input[name=email]').val(email);
                $('input[name=firstname]').val(firstName);
                $('input[name=lastname]').val(lastName);
                $('input[name=facebook]').val(facebook);
                $('input[name=skype]').val(skype);
                $('input[name=phone]').val(phone);
                $('input[name=birthday]').datepicker('setDate', birthday);
                $('select[name=birthplace]').val(birthPlace);
                $('select[name=gender]').val(gender);
                $('textarea[name=introduction]').val(intro);
                if (avatar != ''){
                    path = avatar.split('\\');
                    avatar = './../'+path[1]+'/'+path[2];
                    var dragAndDrop 	= $('.dragDropInp');
                    var dragDropPrv 	= $('.dragDropPrv');
                    dragDropPrv.find('img').attr('src', avatar);
                    $('#cancelUpload').addClass('hidden');
                    $('#removeAvatar').removeClass('hidden');
                    dragAndDrop.hide();
                    dragDropPrv.show();
                }

                $('#btnAddUser').addClass('hidden');
                $('#btnEditUser').removeClass('hidden');

                showModal(modalID);
            }
        );
    }
}

$(document).ready(function(){
    var usertable = $('#users_tables');
    getUsers(usertable);
    getCities();

    var btnAddUser = $('#btnAddUser');
    btnAddUser.click(function(e){
        addUser();
    });

    $('#removeAvatar').click(function(){
        var userID = window.localStorage.getItem('edtUserId');
        var dragAndDrop 	= $('.dragDropInp');
        var dragDropPrv 	= $('.dragDropPrv');
        if (userID){
            $.post(AJAX_USERS_PATH, 
                {
                    option: 'removeAvatar',
                    id: userID
                }, 
                function(msg){
                    if (msg == 'success'){
                        confirm('Success');
                        $('#cancelUpload').removeClass('hidden');
                        $('#removeAvatar').addClass('hidden');
                        dragAndDrop.hide();
                        dragDropPrv.show();
                    }
                    else{
                        confirm(msg);
                    }
                }
            );
        }
        else{
            return;
        }
    });

    var btnEditUser = $('#btnEditUser');
    btnEditUser.click(function(){
        editUser();
    });
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
                var action =    '<a href="javascript:;" class="btn btn-xs blue" data-user="'+data[i]._id+'" data-option="0" onclick="openModal(this)" data-modal="modal_EditUser">Edit <i class="fa fa-edit"></i></a>'+
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
            hideLoading();
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
    var form     = $('#formUser');
    var formData = new FormData(form[0]);

    formData.append('option', 'addUser');

    if (form[0].checkValidity()){
    
        $.ajax({
            url: AJAX_ADD_USERS_PATH,
            data: formData,
            type: 'POST',
            contentType: false,
            processData: false,
            success: function(data){
                if(data == 'OK'){
                    confirm('Success!');
                    window.location.href = window.location.href;
                }
                else{
                    confirm('Something went wrong, try again!');
                    window.location.href = window.location.href;
                }
            }
        });

    }
    else{
        form.find(':submit').click();
    }
}

function editUser(){
    var userID   = window.localStorage.getItem('edtUserId');
    var form     = $('#formUser');
    var formData = new FormData(form[0]);

    formData.append('option', 'addUser');
    formData.append('id', userID);

    if (form[0].checkValidity()){
    
        $.ajax({
            url: AJAX_EDIT_USERS_PATH,
            data: formData,
            type: 'POST',
            contentType: false,
            processData: false,
            success: function(data){
                if(data == 'OK'){
                    confirm('Success!');
                    window.location.href = window.location.href;
                }
                else{
                    confirm('Something went wrong, try again!');
                    window.location.href = window.location.href;
                }
            }
        });

    }
    else{
        form.find(':submit').click();
    }
}