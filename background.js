// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the user clicks on the browser action.


var lastVisitorCount = 0;


chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(
      null, {code:"document.body.style.background='red !important'"});

  console.log('Browser action has been clicked.');
});

chrome.browserAction.setBadgeBackgroundColor({color:[0, 200, 0, 100]});


chrome.extension.onConnect.addListener(function(port) {

	console.log('Connection established with the background script.' + port);
  console.log(port);

  port.onMessage.addListener(function(msg) {

  	console.log(msg);


    var rules = JSON.parse(localStorage.getItem('rules'));

  	
    if( msg.visitors && rules != null && msg.visitors >= rules.visitor_count /*&& msg.visitors > lastVisitorCount*/ ){

          if( !rules.silent )
            audioElement.play();

          lastVisitorCount = msg.visitors;
    }

    chrome.browserAction.setBadgeText({text: String(msg.visitors)});
    
  });
});


var audioElement = document.createElement('audio');
	audioElement.src = chrome.extension.getURL("tunya.ogg");
	audioElement.load();
