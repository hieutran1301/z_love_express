var AJAX_PATH = "";

$(document).ready(function(){

    var csrf = $('input[name=_csrf]').val();
	if (csrf != null || csrf != undefined) {
		$.ajaxSetup({
			headers: {'X-CSRF-Token': csrf}
		});
	}

});