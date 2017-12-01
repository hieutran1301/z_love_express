var AJAX_PATH = "../../../ajax-home/getuserbyid";
var AJAX_AVATAR = "../../../ajax-home/uploadavatarbycropper";

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

	$('[data-toggle="datepicker"]').datepicker({
		format: 'dd/mm/yyyy'
	});

	$('#inpUploadAvatar').change(function(){
		var reader = new FileReader();

		showModal('cropImage');

		if(this.files && this.files[0]){

			reader.onload = function(e){
				$('#cropperImg').attr('src', e.target.result);
				$('#cropperImg').cropper('destroy');
				$('#prvImg').removeClass('hidden');
				$('.zmodal-loading').addClass('hidden');

				$('#prvImg img').cropper({
					aspectRatio: 1/1,
					crop: function(e){
					}
				});
			}
	
			reader.readAsDataURL(this.files[0]);
		}
	});

	$('.zmodal-footer .btn-cancel').click(function(){
		var modalId = $(this).parents('.zmodal').attr('id');
		$('#cropperImg').cropper('destroy');
		$('#cropperImg').attr('scr', '');
		$('.zmodal-loading').removeClass('hidden');
		$('#prvImg').addClass('hidden');
		hideModal(modalId);
	});

	$('#btnSaveAvatar').click(function(e){
		$('#cropperImg').cropper('getCroppedCanvas', {fillColor: '#fff'}).toBlob(function(blob){
			var formData = new FormData();
			var userId 	 = $('input[name=_userid]').val();

			formData.append('croppedImage', blob);
			formData.append('userId', userId);

			$.ajax(AJAX_AVATAR, {
				method: "POST",
				data: formData,
				processData: false,
				contentType: false,
				success: function(data){
					if(data.status == 'success'){
						swal({
							title: "Thành công",
							text: "Thay đổi ảnh đại diện thành công!",
							type: "success"
						}).then(function(result){
							if (result.value){
								window.location.href = window.location.href;
							}
						});
					}
					else{
						swal({
							title: "Oops!",
							text: "Có gì đó sai sai rồi á! Thử lại nha!",
							type: "warning"
						}).then(function(result){
							if (result.value){
								window.location.href = window.location.href;
							}
						});
					}
				},
				error: function(){
					swal({
						title: "Oops!",
						text: "Có gì đó sai sai rồi á! Thử lại nha!",
						type: "warning"
					}).then(function(result){
						if (result.value){
							window.location.href = window.location.href;
						}
					});
				} 
			});
		});
	});
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
	var article = form.find('article');

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

	article.each(function(){
		var _this = $(this);
		if (_this.is(':visible')){
			_this.addClass('hidden');
			_this.next().removeClass('hidden');
		}
		else{
			var defaultVal = _this.html();
			_this.next().html(defaultVal);
			_this.removeClass('hidden');
			_this.next().addClass('hidden');
		}
	});
}