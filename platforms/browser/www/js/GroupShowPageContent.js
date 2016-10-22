/**
 * 群組頁面畫面渲染
 */
var pages = ["#List", "#Make"];
var nowPage = 0;

$(document).on("pageshow", "#group",function(){
	pageTopBKColorInit();
	pageRender();
	//showGroupList();
	$("#List").show();
});

$("#groupListBtn").on("click", function(){
	nowPage = 0;
	pageTopBKColorInit();
	pageRender();
	htmlShow();
});

$("#groupMakeBtn").on("click", function(){
	nowPage = 1;
	pageTopBKColorInit();
	pageRender();
	htmlShow();
});

/**
 * [pageTopBKColorInit 將上方工具列選項顏色初始化]
 */
function pageTopBKColorInit(){
	$("#List").hide();
	$("#Make").hide();
	$("#groupListBtn").css("background", "white");
	$("#groupMakeBtn").css("background", "white");
}

/**
 * [pageRender 上方工具列渲染]
 */
function pageRender(){
	switch(nowPage){
		case 0:
			$("#groupListBtn").css("background", "#6666FF");
			break;

		case 1:
			$("#groupMakeBtn").css("background", "#6666FF");
			break;
	}
}

/**
 * [htmlShow 將切換到頁面之隱藏div顯示]
 */
function htmlShow(){
	$(pages[nowPage]).show();
}