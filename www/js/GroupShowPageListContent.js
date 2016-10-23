function showGroupList(){
	$("#privateGroupList li").parent().remove();
	$("#publicGroupList li").parent().remove();
	$.ajax({
		url: "http://140.130.35.62/csie40343142/Tour_System_server/php/GroupShowList.php",
		type: "POST",
		dataType: "json",
		success: function(result){
			console.log(result);
			var dataForLoop = (result['群組名稱'].length >= result['群組權限'].length)? result['群組權限'].length:result['群組名稱'].length;
			for(var i=0; i<dataForLoop; i++){
				if(result['群組權限'][i] == 0){
					$("#privateGroupList").append("<li><a>"+result['群組名稱'][i]+"</a></li>");
				}
				else{
					$("#publicGroupList").append("<li><a>"+result['群組名稱'][i]+"</a></li>");
				}
			}
			$("#privateGroupList").listview("refresh");
			$("#publicGroupList").listview("refresh");
		},
		error: function(){
			console.log("asdasdads");
		}
	});
}

