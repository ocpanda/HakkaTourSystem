/**
 * 群組頁面
 * 目前有的群組顯示
 */

function showGroupList(){
	$("#privateGroupList").children().remove();
	$("#publicGroupList").children().remove();
	$.ajax({
		url: "http://140.130.35.62/csie40343142/Tour_System_server/php/TourGroupShowList.php",
		type: "POST",
		dataType: "json",
		success: function(result){
			console.log(result);
			var dataForLoop = (result['群組名稱'].length >= result['群組權限'].length)? result['群組權限'].length:result['群組名稱'].length;
			//列表加入
			for(var i=0; i<dataForLoop; i++){
				if(result['群組權限'][i] == 1){
					$("#privateGroupList").append("<li><a id='"+result['群組名稱'][i]+"' class='priList'>"+result['群組名稱'][i]+"</a></li>");
				}
				else{
					$("#publicGroupList").append("<li><a id='"+result['群組名稱'][i]+"' class='pubList'>"+result['群組名稱'][i]+"</a></li>");
				}
			}

			var count1 = $("#privateGroupList").find("li").length;
			var count2 = $("#publicGroupList").find("li").length;
			//沒有群組加入一字串
			if(count1 == 0){
				$("#privateGroupList").append("<li><p style='font-size: 20px'>尚無群組</p></li>");
			}
			if(count2 == 0){
				$("#publicGroupList").append("<li><p style='font-size: 20px'>尚無群組</p></li>");
			}

			//點擊事件綁定
			$(".priList").click(function(){
				var id = $(this).attr("id");
				joinWinShow(id, "private");
				//console.log(id);
			});
			$(".pubList").click(function(){
				var id = $(this).attr("id");
				joinWinShow(id, "public");
				//console.log(id);
			});
			

			$("#privateGroupList").listview("refresh");
			$("#publicGroupList").listview("refresh");
			//console.log($("#privateGroupList").find("li").length);
		},
		error: function(){
			console.log("asdasdads");
		}
	});
}

function joinWinShow(name, type){
	$("#joinTitle").html("加入" + name);
	$("#groupJoin").popup("open", {transition: "pop"});
	if(type == "public"){
		$("#joinBtnDiv").hide();
	}
	else{
		$("#joinBtnDiv").show();
	}
}