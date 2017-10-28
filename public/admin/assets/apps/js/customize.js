$(document).ready(function(){
	//Active sidebar navigation
	var path = window.location.pathname;
	var sitepath = path.split('/');
	$('li.active.open').removeClass('active open');
	$('#nav-'+sitepath[2]).addClass('active open');
	//=============================================
});