var port = port || {},
	visitorCountView,
	MUTATION_OBSERVER_REATTACH_INTERVAL = 2;	// 2 sec

var DOM_ID_VISITOR_COUNT = "ID-overviewCounterValue";

console.log('Waiting to attach MutationObserver to the page.');

var failSafeAttacher = function(){

	// TODO: if already attached MutationObserver has been removed
	// from the DOM
	// there is no way to attach it back.
	if( attachMutationObserver() ){
		console.log('MutationObserver attached successfully to the page.');
		sendVisitorCount();
	}
	else{
		console.error('Error while attaching MutationObserver to the page.');
		console.info('Another attempt to attach MutationObserver in ' + MUTATION_OBSERVER_REATTACH_INTERVAL + ' sec.');
		setTimeout(failSafeAttacher, MUTATION_OBSERVER_REATTACH_INTERVAL * 1000);
	}
};

setTimeout(failSafeAttacher, 2000);

function sendVisitorCount(){

	if(visitorCountView == undefined || visitorCountView == null){
		console.log('The view from DOM is null. Apparently Google has changed the ID of the view.');
		return;
	}

	console.log('Visitors: '+ visitorCountView.innerText);

	port = chrome.extension.connect({name: "AnalyticsNotifierPort"});
	port.postMessage({visitors: parseInt(visitorCountView.innerText)});
	
	port.onMessage.addListener(function(msg) {
		console.log(msg);
	});
}


function attachMutationObserver(){

	try{

		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || window.OMutationObserver;
	  	visitorCountView = document.getElementById(DOM_ID_VISITOR_COUNT);
	 
	  	var observer = new MutationObserver(function(mutations) {
	  		/*console.log(mutations[0]);
	        console.log(mutations[0].target);*/
	        sendVisitorCount();
	  	});
	 
		observer.observe(visitorCountView, {
		  	attributes: true, 
		  	childList: true, 
		  	characterData: true,
		  	attributeOldValue: true,
		  	characterDataOldValue: true
		});

	} catch(e){
		console.log(e);
		return false;
	}

	return true;
}