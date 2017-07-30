var downloadManager = new DownloadManager();
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    downloadManager.queueDownload(message);
});
