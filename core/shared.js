function draw(domList, videoUrl, index) {
	var element = domList.get(index);
	var dldBtnImg = $('<img>').attr('src', chrome.extension.getURL('icon/48.png')).attr('style', 'width: 16px; vertical-align: middle;');
	var dldBtn = $('<a>').addClass('sbo_download_link').attr('title', 'Click to Download').attr('style', 'cursor: pointer; margin-left: 7px;').append(dldBtnImg);
	var title = $(element).attr('title') || $(element).text();
	var courseTitle = $('.title-info .metadata .title.t-title').text();

	dldBtn.click(function () {
		var http = new XMLHttpRequest();
		http.open('HEAD', videoUrl);
		http.onreadystatechange = function () {
			if (this.readyState === this.DONE) {
				var finalUrl = this.responseURL.slice(0, -1 * '/clipTo/60000/name/a.mp4'.length);
				chrome.runtime.sendMessage({
					videoUrl: finalUrl,
					index: index,
					title: title,
					courseTitle: courseTitle
				});
			}
		};
		http.send();
	});
	dldBtn.insertAfter($(element));
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message === "start_batch_download") {
		$('.sbo_download_link').click();
	}
});
