var pagelimit = 10;

$(document).ready(function(){
	//Active sidebar navigation
	var path = window.location.pathname;
	var sitepath = path.split('/');
	$('li.active.open').removeClass('active open');
	$('#nav-'+sitepath[2]).addClass('active open');
	//=============================================

	//CSRFTOKEN
	var csrf = $('meta[name=_csrf]').attr('content');
	if (csrf != null || csrf != undefined) {
		$.ajaxSetup({
			headers: {'X-CSRF-Token': csrf}
		});
	}

	pagination();
});

function pagination(){
	var table = $('table tbody');
	var count = table.find('tr').length;
	if (count < pagelimit) {
		var page = 1;
	}
	else{
		if (count % pagelimit == 0) {
			var page = Math.floor(count/pagelimit);
		}
		else{
			var page = Math.floor(count/pagelimit) + 1;
		}
	}

	var htmlstart = 	'<ul class="pagination">'+
							'<li>'+
								'<a href="javascript:;" onclick="prevPage(this)" min="1">'+
			                        '<i class="fa fa-angle-left"></i>'+
			                    '</a>'+
							'</li>';
	var htmlend   = 		'<li>'+
							'<a href="javascript:;" onclick="nextPage(this)" max="'+(page+1)+'">'+
		                        '<i class="fa fa-angle-right"></i>'+
		                    '</a>'+
						'</li>'+
					'</ul>';

	var html = '';
	for (var i = 1; i < page+1; i++) {
		if (i==1) {
			html += '<li class="active"><a href="javascript:;" data-value="'+i+'" onclick="movePage(this)">'+i+'</a></li>';
		}
		else{
			html += '<li><a href="javascript:;" data-value="'+i+'" onclick="movePage(this)">'+i+'</a></li>';
		}
	}
	paging(1);
	$('.pagination-wrap').html(htmlstart+html+htmlend);
}

function paging(page){
	maxrec = page*pagelimit-1;
	minrec = (page-1)*pagelimit;
	var tr = $('table tbody tr');
	tr.addClass('hidden');
	tr.each(function(idx){
		if (idx <= maxrec && idx >= minrec) {
			$(this).removeClass('hidden');
		}
	});
}

function movePage(obj){
	var page = $(obj).attr('data-value')*1;
	var parent = $(obj).parent();
	if (parent.hasClass('active') == false) {
		$('.pagination-wrap ul li.active').removeClass('active');
		parent.addClass('active');
		paging(page);
	}
}

function nextPage(obj){
	var page = $('.pagination li.active a').attr('data-value')*1;
	var max  = $(obj).attr('max')*1;
	if (page+1<max) {
		var activeLi = $('.pagination-wrap ul li.active');
		var next = activeLi.next().find('a');
		movePage(next);
	}
}

function prevPage(obj){
	var page = $('.pagination li.active a').attr('data-value')*1;
	var min  = $(obj).attr('min')*1;
	if (page-1>=min) {
		var prev = $('.pagination-wrap ul li.active').prev().find('a');
		movePage(prev);
	}
}