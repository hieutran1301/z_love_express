var AJAX_PATH_APPLY = '../../../ajax-home/apply';


$('.owl-carousel').owlCarousel({
    loop:true,
    margin:10,
    nav:true,
    autoplayTimeout:2000,
    autoplay: true,
    navText: [
        '<i class="fa fa-angle-left"></i>',
        '<i class="fa fa-angle-right"></i>',
    ],
    responsive:{
        0:{
            items:1
        },
        600:{
            items:3
        },
        1000:{
            items:4
        }
    }
});

$(document).ready(function () {
    var csrf = $('input[name=_csrf]').val();
  if (csrf != null || csrf != undefined) {
    $.ajaxSetup({
      headers: {'X-CSRF-Token': csrf}
    });
    }
});

function apply(obj){
    var $this = $(obj);
    var postId = $this.attr('data-value');
    //alert(postId);
    $.post(AJAX_PATH_APPLY,{
        postID : postId
    },function(data){
        //alert(data);
        if(data == 'Success'){
            $this.html('Đã ứng tuyển');
            $this.attr("disabled", true);
        }
    });
}