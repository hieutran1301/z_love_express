var AJAX_PATH_HOMEPAGE = '../../../ajax-home/homepage';
var AJAX_PATH = '../../../ajax-home/checkusername';


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

function getPost() {
  var postLength;
  $.post(AJAX_PATH_HOMEPAGE,{
    option : 'getPost',
  }, function (data) {
    console.log(data);
    for (var i = 0; i < data.length; i++){
      alert(data[i].CreatedBy);
    }
    
  });
};

$(document).ready(function () {
  
});
