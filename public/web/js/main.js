var post_limit_char = 185;

$(window).resize(function(){
	setLoveHeight();
});

window.onload = function () {
  setTimeout(function () {
    $('#Loading').fadeOut();
  },500);
};

$(document).ready(function(){
	setLoveHeight();
});

$('.toggle-menu-dropdown').each(function(){
	var _this = $(this);
	var dest = _this.attr('dropdown-target');
	_this.click(function(){
		if ($('#'+dest).is(':visible')){
			return;
		}
		else{
			var $this = $(this);
			$('#'+dest).slideDown();
			$(document).mouseup(function(e)
			{
				var container = $('#'+dest);
				if (!container.is(e.target) && container.has(e.target).length === 0)
				{
					container.slideUp();
				}
			});
		}
	});
});

function setLoveHeight(){
	var avatar = $(".listlove .love .avatar");
	avatar.each(function(){
		var width=$(this).width();
		$(this).height(width);
	});
}

function test(obj){
	alert($(obj).attr('data-toggle'))
}

function setLoveHeight(){
	var avatar = $(".avatar_list .avatar");
	avatar.each(function(){
		var width=$(this).width();
		$(this).height(width);
	});
}

function parseUploadPath(path){
	path += '';
	path = path.split('\\');
	return path[2];
}

function showModal(modalId){
	if($('#'+modalId).is(':visible')){
		return;
	}
	else{
		$('#'+modalId).fadeIn();
	}
}

function hideModal(modalId){
	if($('#'+modalId).is(':visible')){
		$('#'+modalId).fadeOut();
	}
	else{
		return;
	}
}

// $('.close-zmodal').each(function(){
// 	var $this = $(this);
// 	$this.click(function(e){
// 		var modalId = $this.parents('.zmodal').attr('id');
// 		hideModal(modalId);
// 	});
// });

$('button[data-toggle=close-zmodal]').click(function(){
	var $this = $(this);
	var modalId = $this.parents('.zmodal').attr('id');
	hideModal(modalId);
});

$('.post-content .post-body').each(function(){
	var p = $(this).find('p');
	var text = p.text();
	if (text.length > post_limit_char){
		text = text.substr(0, post_limit_char)+' ...';
		p.text(text);
	}
});
