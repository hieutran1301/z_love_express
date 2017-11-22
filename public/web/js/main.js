$(window).resize(function(){
	setLoveHeight();
});

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