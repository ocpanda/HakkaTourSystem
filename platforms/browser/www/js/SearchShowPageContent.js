var pages = ["#pageOne", "#pageTwo"];
var nowPage = 0;

$(document).on("pageshow", "#search",function(){
	pageTopBKColorInit();
	pageRender();
	$("#pageOne").show();
});

$("#goPageOne").on("click", function(){
	nowPage = 0;
	pageTopBKColorInit();
	pageRender();
	htmlShow();
});

$("#goPageTwo").on("click", function(){
	nowPage = 1;
	pageTopBKColorInit();
	pageRender();
	htmlShow();
});

function pageTopBKColorInit(){
	$("#pageOne").hide();
	$("#pageTwo").hide();
	$("#goPageOne").css("background", "white");
	$("#goPageTwo").css("background", "white");
}

function pageRender(){
	switch(nowPage){
		case 0:
			$("#goPageOne").css("background", "#6666FF");
			break;

		case 1:
			$("#goPageTwo").css("background", "#6666FF");
			break;
	}
}

function htmlShow(){
	$(pages[nowPage]).show();
}

