/**
 * 滑動換頁功能
 *
 * 變數:
 * pages 定義所有頁面
 * pagesNum 紀錄目前頁面
 */
var pages = ["index.html", "search.html", "group.html", "day.html", "message.html", "scan.html"];

//向右滑動
var pagesNum = pages.length;
$(document).bind("swiperight", function(){
	pagesNum = ((pagesNum - 1) < 0)? pages.length-1: pagesNum-1;
	$.mobile.changePage(pages[pagesNum],{
		"transition": "flip",
		"reverse": true
	});
});

//向左滑動
$(document).bind("swipeleft", function(){
	pagesNum = ++pagesNum % pages.length;
	$.mobile.changePage(pages[pagesNum],{
		"transition": "flip"
	});
});