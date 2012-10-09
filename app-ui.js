var DEFAULT_USER_THRESHOLD_COUNT = 15

function saveRules(){
    console.log('saving data');

    try{
    	var rulesObj = {};

    	rulesObj.visitor_count = parseInt($("#visitor_count").val());
    	rulesObj.silent = $('#silent-operations').is(':checked');

      localStorage.setItem('rules', JSON.stringify(rulesObj) );
    } catch(e){
      console.error('Error while setting data in localStorage.');
    }

  showRules();
}

$(document).ready(function(){
	console.log('save button is ready.');
	init();
	showRules();

	$('#save-rules').click(saveRules);

	$('#silent-operations').click(saveRules);
});

function init(){
	var rules = JSON.parse(localStorage.getItem('rules'));
	console.log(rules);

	//first time load.
	if( rules == null ){
		rules = {};
		console.log('Initializing for the first time.');
		rules.visitor_count = DEFAULT_USER_THRESHOLD_COUNT;

		rules.silent = false;
		localStorage.setItem('rules', JSON.stringify(rules) );
	}
}

function showRules(){
	console.log('showing saved data');
	var rules = JSON.parse(localStorage.getItem('rules'));
	console.log(rules);

	//populate the UI as per the rules already set.
	if( rules != null ){
		if( rules.visitor_count != null && rules.visitor_count != undefined )
			$('#visitor_count').val(rules.visitor_count);

		if( rules.silent != null && rules.silent != undefined )
			$('#silent-operations').attr('checked', rules.silent);
	}
}