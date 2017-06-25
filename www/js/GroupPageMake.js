/**
 * 群組創建頁面
 * 建立按鈕按下
 */
$("#submitBtn").on("click", function(event) {
	var data;
	var passData = $("input[name='groupPass']").val();
	var openType = $("select[name='groupOpen']").val();
	if(openType == "on"){
		data = {groupName: $("input[name='groupName']").val(), groupOpen: openType, groupPass: "NULL"};
		var serverReplyMsg;
	}
	else{
		if(passData.length <= 0){
			$("#makePassPopup").popup("open", {positionTo: "#submitBtn", transition: "pop"});
			setTimeout(function(){
				$("#makePassPopup").popup("close");
			},1000);
			return;
		}
		else{
			var password = stringClean(passData);
			data = {groupName: $("input[name='groupName']").val(), groupOpen: $("select[name='groupOpen']").val(), groupPass: passData};
		}
	}
	$.ajax({
		url: "http://140.130.35.62/hakka/hakkamanager/php/TourGroupMake.php",
		type: "POST",
		data: data,
		dataType: "text",
		success: function(result){
			serverReplyMsg = result;
			$("#makeSubPopupMsg").html(serverReplyMsg);
			$("#makeSubPopup").popup("open", {positionTo: "#submitBtn", transition: "pop"});
			var timeOutTime;
			if(result == "建立成功!"){
				timeOutTime = 1000;
			}
			else{
				timeOutTime = 2000;
			}
			setTimeout(function(){
				$("#makeSubPopup").popup("close");
				if(timeOutTime == 1000){
					console.log("page change!!!!!!!");
					nowPage = 0;
					$("input[name='groupName']").val("");
					pageTopBKColorInit();
					pageRender();
					htmlShow();
					showGroupList();
				}
				else{
					$("input[name='groupName']").val("");
				}
			}, timeOutTime);
			//alert(result);
		}
	});
	event.preventDefault();  //將submit ajax傳送關閉
});

function stringClean(instr){
	var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？]");
	var clnstr = "";
	for(var i=0; i<instr.length; i++){
		clnstr += instr.substr(i, 1).replace(pattern, '');
	}
	return clnstr;
}
