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

	//fetch info
	// fetchInfo(USERID);



});

function fetchInfo(id){
	$.post(AJAX_PATH, 
		{
			id: id
		}, 
		function(data){
			if (data != '' && data != 404) printInfo({
				firstname		: data.FirstName,
				lastname		: data.LastName,
				gender			: data.Gender,
				birthday 		: data.DateOfBirth,
				currplace		: data.CurrentPlace,
				relationship 	: 0,
				working 		: data.Working,
				workingplace    : 'University of Information Technology',
				avatar			: parseUploadPath(data.Avatar)
			});
		}
	);
}

function printInfo(data){
	var txtFullName = $('#FullName');
	var txtGender 	= $('#Gender');
	var txtBirthday	= $('#Birthday');
	var txtPlace 	= $('#Place');
	var txtRela 	= $('#Relationship');
	var txtWorking 	= $('#Working');
	var txtWkPlace 	= $('#WorkingPlace');
	var avatar 		= $('#bxAvatar');
	var background	= $('.bg-img');

	txtFullName.html(data.firstname+' '+data.lastname);
	if (data.gender == 1) {txtGender.html("Nam")} else txtGender.html("Nữ");
	txtBirthday.html(data.birthday);
	txtPlace.html(data.currplace);
	if (data.relationship == 0) {txtRela.html('Độc thân')} else {txtRela.html('Đang hẹn hò')};
	txtWorking.html(data.working);
	txtWkPlace.html(workingplace);
	avatar.css('background-image', 'url(\'../uploads/'+data.avatar+'\')');
	background.css('background-image', 'url(\'../uploads/'+data.avatar+'\')');
}

function changeStateInp(obj){
	var formID  = $(obj).attr('data-target');
	var form 	= $('#'+formID);
	var spInp	= form.find('.span-inp');
	var spSlt	= form.find('.span-select');
	var actBtn  = $('.act-button');

	spInp.each(function(){
		var _this = $(this);
		if (_this.is(':visible')){
			_this.addClass('hidden');
			_this.next().removeClass('hidden');
			actBtn.show();
		}
		else{
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
			_this.removeClass('hidden');
			_this.next().addClass('hidden');
		}
	});
}