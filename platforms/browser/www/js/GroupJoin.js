/**
 * 使用者加入群組
 * event: 點擊事件
 * group: 欲加入群組名稱
 * type:  群組類型
 */

function groupJoin(event, groupName, type){
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
	data = {joinGroup:groupName, joinName: joinName, joinPass: joinPass};
	
	$.ajax({
		url: "http://140.130.35.62/csie40343142/Tour_System_server/php/TourGroupJoin.php",
		type: "POST",
		data: data,
		dataType: "text",
		success: function(result){
			console.log(result);
		}
	});
	event.preventDefault();  //將submit ajax傳送關閉
}