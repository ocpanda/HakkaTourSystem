function showGroupList(){
	$.ajax({
		url: "http://140.130.35.62/csie40343142/Tour_System_server/php/GroupShowList.php",
		type: "POST",
		dataType: "json",
		success: function(){

		},
		error: function(){
			
		}
	});
}