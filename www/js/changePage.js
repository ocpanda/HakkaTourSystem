/**
 * 滑動換頁功能
 *
 * 變數:
 * pages 定義所有頁面
 * pagesNum 紀錄目前頁面
 */
var pages = ["index.html", "search.html", "group.html", "day.html", "message.html", "scan.html"];
var footNavBars = ["home", "search", "group", "day", "message", "setting"];

var nowPage;
var nowPages;
for(var i=0; i<6; i++){
	nowPage = location.href.split("/");
	nowPages = nowPage.indexOf(pages[i]);
	
	if(nowPages >= 0)
		break;
}
nowPages = pages.indexOf(nowPage[nowPages]);

$.mobile.ignoreContentEnabled=true;
//向右滑動
var pagesNum = nowPage;
$(document).bind("swiperight", function(){
	pagesNum = ((pagesNum - 1) < 0)? pages.length-1: pagesNum-1;
	$.mobile.changePage("#"+footNavBars[pagesNum],{
		"rel": "external",
		"transition": "flip",
		"reverse": true
	});
});

//向左滑動
$(document).bind("swipeleft", function(){
	pagesNum = ++pagesNum % pages.length;
	$.mobile.changePage("#"+footNavBars[pagesNum],{
		"rel": "external",
		"transition": "flip"
	});
});


/**
 * 底下工具列渲染
 *
 * 變數:
 * footNavBars 工具名稱
 */

/*
$(document).on("pageshow", "#"+footNavBars[nowPages], function(){
	alert("wegfawrgaerg");
	for(var i=0; i<5; i++){
		$("#"+footNavBars[nowPages]+"footNavBar").append("<li><a href=#"+footNavBars[nowPages]
			+" id="+footNavBars[nowPages]+"Img  data-ajax='false'><img style='width:90%;' src='image/"
			+footNavBars[nowPages]+".png' is='image'></a></li>");
	}
});*/