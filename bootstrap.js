// The background script has access to the current Tab object and chrome.* APIs

// when the extension is first installed
chrome.runtime.onInstalled.addListener(function(details) {
    //chrome.storage.sync.set({be_a_buzzkill: true});
});

// listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(function(id, info, tab){
	// Now the million dollar question: Why can't this stuff be done in the manifest?
	// #askgoogle
    if (tab.url.toLowerCase().indexOf("frenzyboard.net") > -1){
		// This needs to be in the bootstrap code to have our page action execute
        chrome.pageAction.show(tab.id);
    }
});


// update the icon when the user's settings change
// chrome.storage.onChanged.addListener(function(changes, areaName){
//     alert("changed settings");
//     console.log("changed settings");
//     if (localStorage["be_a_buzzkill"] == "true"){
//         path = "active-icon.jpeg";
//     } else {
//         path = "inactive-icon.jpeg";
//     }
//     chrome.tabs.getCurrent( function(tab){
//         chrome.pageAction.setIcon({
//             "tabId": tab.id,
//             "path": path
//         });
//     });
// }); 
