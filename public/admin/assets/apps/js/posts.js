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

    //Event button save add new click
    $('#btnAddPost').click(function(e){
        addNewPost();
    });

    //Event button save edit click
    $('#btnEditPost').click(function(e){
        var postID = $('#formPost').attr('data-post');
        editPost(postID);
    });
});

function editPost(postID){
    var form = $('#formPost');

    if (form[0].checkValidity()){
        var title = form.find('input[name=title]').val();
        var fromage = form.find('select[name=fromage]').val();
        var toage = form.find('select[name=toage]').val();
        var description = form.find('textarea[name=description]').val();
        var target = form.find('select[name=target]').val();
        var job = form.find('select[name=job]').val();
        var city = form.find('select[name=city]').val();
        var createdby = form.find('input[name=createdby]').val();
        var status = form.find('select[name=status]').val();
        $.post(AJAX_POST_PATH,
            {
                option: 'editPost',
                title: title,
                fromage: fromage,
                toage: toage,
                description: description,
                target: target,
                job: job,
                city: city,
                createdby: createdby,
                status: status,
                postID: postID
            }, function(data, success){
                if (success == 'success'){
                    var status = data.status;
                    var msg = data.msg;
                    if (status == 'error'){
                        confirm(msg);
                    }
                    else{
                        confirm('Success');
                        window.location.href = window.location.href;
                    }
                }
            }
        );
    }
    else{ // if validate form false
        form.find(':submit').click();
    }
}

function addNewPost(){
    var form = $('#formPost');

    if (form[0].checkValidity()){
        var title = form.find('input[name=title]').val();
        var fromage = form.find('select[name=fromage]').val();
        var toage = form.find('select[name=toage]').val();
        var description = form.find('textarea[name=description]').val();
        var target = form.find('select[name=target]').val();
        var job = form.find('select[name=job]').val();
        var city = form.find('select[name=city]').val();
        var createdby = form.find('input[name=createdby]').val();
        var status = form.find('select[name=status]').val();
        $.post(AJAX_POST_PATH,
            {
                option: 'addNewPost',
                title: title,
                fromage: fromage,
                toage: toage,
                description: description,
                target: target,
                job: job,
                city: city,
                createdby: createdby,
                status: status
            }, function(data, success){
                if (success == 'success'){
                    var status = data.status;
                    var msg = data.msg;
                    if (status == 'error'){
                        confirm(msg);
                    }
                    else{
                        confirm('Success');
                        window.location.href = window.location.href;
                    }
                }
            }
        );
    }
    else{ // if validate form false
        form.find(':submit').click();
    }
}

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
                var action =    '<a href="javascript:;" class="btn btn-xs blue" data-post="'+data[i]._id+'" data-option="1" onclick="openModal(this)" data-modal="modal_Post">Edit <i class="fa fa-edit"></i></a>'+
                                '<a href="javascript:;" class="btn btn-xs red" data-post="'+data[i]._id+'" onclick="removePost(this)">Delete <i class="fa fa-remove"></i></a>';
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

function removePost(obj){
    var postID = $(obj).attr('data-post');
    if (confirm('Do you want to remove this post ?')){
        $.post(AJAX_POST_PATH, {
            option: 'removePost',
            postID: postID
        }, function(data, success){
            if (success == 'success'){
                var status = data.status;
                var msg =  data.msg;
                if (status == 'error'){
                    confirm(msg);
                }
                else{
                    confirm('Successfully!');
                    window.location.href = window.location.href;
                }
            }
            else{
                confirm('Something went wrong, try again!');
                window.location.href = window.location.href;
            }
        });
    }
}

function openModal(obj){
    var option      = $(obj).attr('data-option');
    var modalID     = $(obj).attr('data-modal');
    var modal       = $('#'+modalID);

    showLoading();

    if (option == 0){ //Add new
        resetForm("formPost");
        var modalTitle = 'Add new post';
        modal.find('h4.modal-title').html(modalTitle);
        modal.find('.city').html(_city);
        modal.find('#btnEditPost').addClass('hidden');
        modal.find('#btnAddPost').removeClass('hidden');
        showModal(modalID);
        hideLoading();
    }
    else{ //Edit post
        resetForm("formPost");
        var modalTitle = 'Edit post';
        modal.find('h4.modal-title').html(modalTitle);
        modal.find('.city').html(_city);
        modal.find('#btnEditPost').removeClass('hidden');
        modal.find('#btnAddPost').addClass('hidden');
        var postId = $(obj).attr('data-post');
        $('#formPost').attr('data-post', postId);
        $.post(AJAX_POST_PATH, {
            option: 'getPostById',
            postID: postId
        }, function(data, success){
            if (success == 'success'){ //If ajax request successfully
                modal.find('input[name=title]').val(data.Title);
                modal.find('textarea[name=description]').val(data.Description);
                modal.find('select[name=target]').val(data.Target);
                modal.find('select[name=job]').val(data.Job);
                modal.find('select[name=fromage]').val(data.FromAge);
                modal.find('select[name=toage]').val(data.ToAge);
                modal.find('input[name=createdby]').val(data.CreatedBy);
                modal.find('select[name=city]').val(data.City);
                modal.find('select[name=status]').val(data.Status);
                showModal(modalID);
                hideLoading();
            }
            else{
                swal('Error', 'Oops! Something went wrong, try again!', 'warning');
            }
        });
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