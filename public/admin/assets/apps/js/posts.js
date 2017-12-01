var AJAX_POST_PATH = '../../../../../ajax-admin/post';


var checkbox = '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">'+
                '<input type="checkbox" class="checkboxes" value="1" />'+
                '<span></span>'+
                '</label>';

$(document).ready(function(){
    hideLoading();
    getUsers('posts_tables');
});

function getUsers(table){
    $.post(AJAX_POST_PATH,
        {
            option  : 'fetchPosts'
        },
        function(data){
            var html = '';
            for (var i = 0; i < data.length; i++) {
                if (data[i].Status ==1) {
                    var status = '<span class="label label-sm label-warning"> Pending </span>';
                }
                else{
                    var status = '<span class="label label-sm label-default"> Active </span>'
                }
                var action =    '<a href="javascript:;" class="btn btn-xs blue" data-user="'+data[i]._id+'" data-option="0" onclick="openModal(this)" data-modal="modal_EditUser">Edit <i class="fa fa-edit"></i></a>'+
                                '<a href="javascript:;" class="btn btn-xs red" onclick="removeUser(this)">Delete <i class="fa fa-remove"></i></a>';
                html += '<tr class="odd" id="'+data[i]._id+'">'+
                        '<td>'+checkbox+'</td>'+
                        '<td>'+data[i].Title+'</td>'+
                        '<td>'+data[i].Wiew+'</td>'+
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