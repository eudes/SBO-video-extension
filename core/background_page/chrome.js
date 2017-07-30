// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

function checkForValidUrl(tabId, changeInfo, tab) {
	if (tab && tab.url && tab.url.indexOf('safari') != -1) {
		// show the page action.
		chrome.pageAction.show(tabId);
	}
};

// Called when the user clicks on the page action (chrome bar button)
chrome.pageAction.onClicked.addListener(function (tab) {
	chrome.tabs.sendMessage(tab.id, 'start_batch_download');
});
