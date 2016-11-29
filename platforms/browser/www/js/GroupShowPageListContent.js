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
			var dataForLoop = (result['name'].length >= result['priority'].length)? result['priority'].length:result['name'].length;
			//列表加入
			for(var i=0; i<dataForLoop; i++){
				if(result['priority'][i] == 1){
					$("#privateGroupList").append("<li><a id='"+result['name'][i]+"' class='priList'>"+result['name'][i]+"</a></li>");
				}
				else{
					$("#publicGroupList").append("<li><a id='"+result['name'][i]+"' class='pubList'>"+result['name'][i]+"</a></li>");
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
			$(".priList").on("click", function(){
				var id = $(this).attr("id");
				$("#joinPassDiv").show();
				joinWinShow(id, "private");
				//console.log(id);
			});
			$(".pubList").on("click", function(){
				var id = $(this).attr("id");
				$("#joinPassDiv").hide();
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
/**
 * 使用者加入群組
 * event: 點擊事件
 * group: 欲加入群組名稱
 * type:  群組類型
 */
function joinWinShow(groupName, type){
	//console.log("type is "+type);
	$("#joinTitle").html("加入 " + name);
	$("#groupJoin").popup("open", {transition: "pop"});
	$("#joinBtn").on("click", function(event){
		//console.log("i want join "+groupName);
		var joinName = $("input[name='userName']").val();
		var joinPass;
		if(type == "public"){
			console.log("get public");
			joinPass = "NULL";
		}
		else{
			console.log("get private");
			joinPass = $("input[name='joinPass']").val();
		}
		//console.log(localStorage.getItem("deviceID"));
		data = {userUUID:localStorage.getItem("deviceID"), joinGroup:groupName, joinName: joinName, joinPass: joinPass};
		
		$.ajax({
			url: "http://140.130.35.62/csie40343142/Tour_System_server/php/TourGroupJoin.php",
			type: "POST",
			data: data,
			dataType: "text",
			success: function(result){
				console.log(result);
				$("#groupPopupMsg").html(result);
				$("#groupMsg").popup("open", {transition: "pop"});
				setTimeout(function(){
					$("#groupMsg").popup("close");
					$("#groupJoin").popup("close");
				}, 1000);
			}
		});
		event.preventDefault();  //將submit ajax傳送關閉
	});
}