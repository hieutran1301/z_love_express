var AJAX_PATH = "../../../ajax-home/getuserbyid";

var firstname 		= '',
	lastname  		= '',
	gender			= 1,
	birthday 		= '',
	currplace		= 1,
	relationship 	= 0,
	working 		= '',
	workingplace    = 'University of Information Technology';

var USERID = '';

var csrf = $('input[name=_csrf]').val();
if (csrf != null || csrf != undefined) {
	$.ajaxSetup({
		headers: {'X-CSRF-Token': csrf}
	});
}

$(document).ready(function(){
	//get userid
	USERID = $('input[name=_userid]').val();
	$('#btnSave').click(function(){
		saveBasicInfo();
	});

	$('#myModal').modal('show');
});

function saveBasicInfo(){
	// should be validate form before submit ;)
	var form = $('#frmBasicInfo');
	// < validate with form[0] >
	form.find(':submit').click();
}


function changeStateInp(obj){
	var formID  = $(obj).attr('data-target');
	var form 	= $('#'+formID);
	var spInp	= form.find('.span-inp');
	var spSlt	= form.find('.span-select');
	var grinp	= form.find('.span-gr-inp');
	var actBtn  = $('.act-button');

	spInp.each(function(){
		var _this = $(this);
		if (_this.is(':visible')){
			_this.addClass('hidden');
			_this.next().removeClass('hidden');
			actBtn.show();
		}
		else{
			var defaulVal = _this.html();
			_this.next().val(defaulVal);
			_this.removeClass('hidden');
			_this.next().addClass('hidden');
			actBtn.hide();	
		}
	});

	spSlt.each(function(){
		var _this = $(this);
		if(_this.is(':visible')){
			_this.addClass('hidden');
			_this.next().removeClass('hidden');
		}
		else{
			var defaultVal = _this.next().attr('default-value');
			_this.next().val(defaultVal);
			_this.removeClass('hidden');
			_this.next().addClass('hidden');
		}
	});

	grinp.each(function(){
		var _this = $(this);
		if (_this.is(':visible')){
			_this.addClass('hidden');
			_this.next().removeClass('hidden');
		}
		else{
			var _inp = _this.next().find('input');
			_inp.each(function(){
				var defaultVal = $(this).attr('default-value');
				$(this).val(defaultVal);
			});
			_this.removeClass('hidden');
			_this.next().addClass('hidden');
		}
	});
}