$("#submitBtn").on("click", function(event) {
	var data = {groupName: $("input[name='groupName']").val(), groupOpen: $("select[name='groupOpen']").val()};
	var serverReplyMsg;
	$.ajax({
		url: "http://140.130.35.62/csie40343142/Tour_System_server/php/GroupMake.php",
		type: "POST",
		data: data,
		dataType: "text",
		success: function(result){
			serverReplyMsg = result;
			$("#makeSubPopupMsg").html(serverReplyMsg);
			$("#makeSubPopup").popup("open", {positionTo: "#submitBtn", transition: "pop"});
			setTimeout(function(){
				$("#makeSubPopup").popup("close");
				nowPage = 0;
				$("input[name='groupName']").val("");	
				$("select[name='groupOpen']").find("[value='off']").attr("selected", true);
				pageTopBKColorInit();
				pageRender();
				htmlShow();
				location.reload();
			}, 1000);
			//alert(result);
		}
	});
	event.preventDefault();  //將submit ajax傳送關閉
});