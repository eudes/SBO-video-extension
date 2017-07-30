function DownloadManager(_settings) {
	// var pastDownloads = [];
	var activeDownloads = new ObservableArray();
	var queuedDownloads = new ObservableArray();

	var settings = _settings || {
		concurrentDownloads: 10,
		downloadsPath: "sbo/"
	};

	// Queue control
	queuedDownloads.addEventListener('itemadded', function (e) {
		if (activeDownloads.length < settings.concurrentDownloads) {
			queuedDownloads.splice(e.item, 1);
			activeDownloads.push(e.item);
		}
	});

	activeDownloads.addEventListener('itemremoved', function (e) {
		// pastDownloads.push(e.item);

		if (queuedDownloads.length > 0 && activeDownloads.length < settings.concurrentDownloads) {
			var newItem = queuedDownloads.shift();
			activeDownloads.push(newItem);
		}
	});

	// Chrome downloads
	activeDownloads.addEventListener('itemadded', function (e) {
		startDownload(e.item);
	});

	function startDownload(message) {
		var downloadCb = function (downloadItemId) {
			chrome.downloads.onChanged.addListener(downloadChangedFactory(message, downloadItemId));
		};

		chrome.downloads.download({
			url: message.videoUrl,
			filename: generateFilename(message.index, message.title, message.courseTitle),
			saveAs: false,
			conflictAction: 'prompt'
		}, downloadCb);
	}

	function downloadChangedFactory(message, downloadItemId) {
		return function downloadChanged(downloadDelta) {
			if (typeof downloadDelta !== "undefined" &&
				downloadItemId === downloadDelta.id &&
				typeof downloadDelta.state !== "undefined" &&
				(downloadDelta.state.current === "complete" || downloadDelta.state.current === "interrupted")
			) {
				finishDownload(message);
			}
		};
	}

	function finishDownload(message) {
		activeDownloads.splice(message, 1);
	}

	// Utils
	function generateFilename(index, title, courseTitle){
		var subdir = courseTitle ? sanitize(courseTitle) + '/' : ''; 
		return settings.downloadsPath + subdir + leftPad(index + 1) + ' - ' + title.replace(/\W+/g, " ") + '.mp4'
	}

	function leftPad(num) {
		var str = num + "";
		var pad = "000";
		return pad.substring(0, pad.length - str.length) + str;
	}


	return {
		queueDownload: function queueDownload(download) {
			queuedDownloads.push(download);
		},
	};
}
