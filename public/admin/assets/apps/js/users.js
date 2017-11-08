var AJAX_USERS_PATH = '../../../../../ajax-admin/';

var checkbox = '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">'+
                    '<input type="checkbox" class="checkboxes" value="1" />'+
                    '<span></span>'+
                '</label>';

$(document).ready(function(){
    var usertable = $('#users_tables');
    getUsers(usertable);
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
                                '<a href="javascript:;" class="btn btn-xs red">Delete <i class="fa fa-remove"></i></a>';
                html += '<tr class="odd">'+
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