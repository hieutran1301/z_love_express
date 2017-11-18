$(window).resize(function(){
	setLoveHeight();
});

$(document).ready(function(){
	setLoveHeight();
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

function test(obj){
	alert($(obj).attr('data-toggle'))
}