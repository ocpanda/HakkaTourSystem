/***********************
**					  **
**	    Beacon  	  **
**					  **
************************/

var dataNum = 0;
var beaconDataStorage = new BeaconDataStorage();
var foundDevices = [];
var scanBeacon;

/**
 * Beacon data storage class
 * use for local storage
 * call this class to put your data into local storage
 */

function BeaconDataStorage(){
	this.dataStorage = window.localStorage;
}

BeaconDataStorage.prototype.getData = function(key){
	return this.dataStorage.getItem(key);
}

BeaconDataStorage.prototype.setData = function(key, item){
	this.dataStorage.setItem(key, item);
}

BeaconDataStorage.prototype.removeData = function(key){
	this.dataStorage.removeItem(key);
}

BeaconDataStorage.prototype.clearData = function(){
	this.dataStorage.clear();
}

/***********************
**					  **
**	  PageChange 	  **
**					  **
************************/

var pages = ["#pageOne", "#pageTwo"];
var nowPage = 0;


pageTopBKColorInit();
pageRender();
$("#pageOne").show();

$(window).ready(function() {
	getData();
});

function pageTopBKColorInit(){
	$("#pageOne").hide();
	$("#pageTwo").hide();
	$("#goPageOne").css("background", "white");
	$("#goPageTwo").css("background", "white");
}

/***********************
**					  **
**	 被點選時呈現藍底 **
**					  **
************************/

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

$("#goPageOne").click(function() {
	nowPage = 0;
	pageTopBKColorInit();
	pageRender();
	htmlShow();
});

$("#goPageTwo").click(function() {
	nowPage = 1;
	pageTopBKColorInit();
	pageRender();
	htmlShow();
});


/***********************
**					  **
**	 KeyWordProcess   **
**					  **
************************/

// $("#keyWord").keypress(function(event) {
// 	if(event.which == 13)
// 		alert($("#keyWord").val());
// });

/***********************
**					  **
**	 processData	  **
**					  **
************************/

var allView = [];

function getData() {
	$.when($.getJSON('http://140.130.35.62/csie40343113/hakkaPHP/get.php')).done(function(result){
		allView = result;
		imgProcess();
	});
};


function imgProcess() {
	var imgHeadler = '<img src="http://140.130.35.62/hakka/hakkamanager';
	var imgFoodler = '" height="150" width="150">';
	for(var i = 0 ; i < allView.length ; i++)
	{
		allView[i][1] = imgHeadler + allView[i].url + imgFoodler;
	}
	show();
}

function show() {
	var data = allView;
	table = $('#example').DataTable( {
        "data": data,
        "columns": [
			{ title: "ID" },
            { title: "圖片" },
            { title: "名字" }
        ]
    });
}


$('#example').on('click', 'tr', function () {

	var data = table.row( this ).data();

	if(typeof data == 'undefined')
		return;

	var value = allView[data[0] - 1].id;

	console.log(value);
	
	sendValueForNewPage(value);
});

function sendValueForNewPage(val) {
	var winOpen = window.open('default.html?' + val);
}

// function showData() {

// 	for(var i = 0; i < ; i+=3)
// 	{
// 		var html += 	"<div class='ui-grid-b' style='height:150px;width:100%'>"+
// 							    "<div class='ui-block-a' style='height:100%;'>" + 
// 							    	"<div is='icon' style='width:100%; height:100%; position:relative'>" + 
// 								    	"<span class='ui-li-count' style='position:absolute; display:none; z-index:1; right:0; top:6px;'></span>" + 
// 								    	"<a href='#' class='ui-btn ui-mini ui-corner-all ui-shadow'" + 
// 								    	" style='display:block;margin:5px;height:50%;background-image: url(" + "image/data/" + items[i] + ".jpg); background-size: 95% 80%; background-position: 50% 50%; background-repeat: no-repeat no-repeat;'>" +
// 								    	"</a>" +
// 								    	"<div style='text-align:center;'>" + pagesIntrc[i] +"</div>" + 
// 							    	"</div>" +
// 							    "</div>";
// 							    if(i+1 >= items.length)
// 							    	break;
// 				html += 	    "<div class='ui-block-b' style='height:100%;'>" + 
// 							    	"<div is='icon' style='width:100%; height:100%; position:relative'>" +
// 								    	"<span class='ui-li-count' style='position:absolute; display:none; z-index:1; right:0; top:6px;'></span>" + 
// 								    	"<a href='#' class='ui-btn ui-mini ui-corner-all ui-shadow'" + 
// 								    	" style='display:block;margin:5px;height:50%;background-image: url(" + "image/data/" + items[i+1] + ".jpg); background-size: 95% 80%; background-position: 50% 50%; background-repeat: no-repeat no-repeat;'>" +
// 								    	"</a>" +
// 								    	"<div style='text-align:center;'>" +pagesIntrc[i+1] + "</div>" + 
// 							    	"</div>" +
// 							    "</div>";
// 							    if(i+2 >= items.length)
// 							    	break;
// 				html +=		    "<div class='ui-block-c' style='height:100%;'>" +
// 							    	"<div is='icon' style='width:100%; height:100%; position:relative'>" +
// 								    	"<span class='ui-li-count' style='position:absolute; display:none; z-index:1; right:0; top:6px;'></span>" +
// 								    	"<a href='#' class='ui-btn ui-mini ui-corner-all ui-shadow'" + 
// 								    	" style='display:block;margin:5px;height:50%;background-image: url(" + "image/data/" + items[i+2] + ".jpg); background-size: 95% 80%; background-position: 50% 50%; background-repeat: no-repeat no-repeat;'>" +
// 								    	"</a>" +
// 								    	"<div style='text-align:center;'>" + pagesIntrc[i+2] + "</div>" +
// 							    	"</div>" +
// 							    "</div>" +
// 						   "</div>";

// 	}
// }




/***********************
**					  **
**	  autoComplete    **
**					  **
************************/

// var completeWord = ['雙頭鋸', '鋒仔', '米篩目板'];

// $("#keyWord").autocomplete({source: completeWord});


/***********************
**					  **
**	  BeaconScan 	  **
**					  **
************************/


// $("#scanBtn").click(function() {
// 	var scanSeconds = 5;
// 	foundDevices = [];
// 	console.log("scanning!");
// 	bluetoothle.startScan(
// 		function(result){
// 			console.log("scan status "+result.status);
// 			if (result.status === "scanStarted") {
// 		        console.log("Scanning for devices");
// 		    }
// 		    else if (result.status === "scanResult") 
// 		    {
// 		        if (!foundDevices.some(function (device) {
// 		            return device.address === result.address;
// 		        })) 
// 		        {
// 		            console.log("FOUND DEVICE:");
// 		            var name = new Array();
// 		            var name = result.name.toString().split(" ");
// 		            console.log(name[0]);
// 		            console.log($("#my"+name[0]).length);
// 		            if($("#my"+name[0]).length === 0){
// 			            $("#scanData").append("<tr id=my"+name[0]+">"+
// 							"<th class='beaconName'>"+result.name+"</th>"+
// 							"<th class='beaconUUID'>"+result.address+"</th>"+
// 				**			"<th class='beaconRSSI'>"+result.rssi+"</th>"+"</tr>");
// 			            console.log("dataNum: "+dataNum);
// 			            console.log($("#my"+name[0]).length);
// 			        }
// 			        else{
// 			        	console.log("change rssi");
// 			        	$("#my"+name[0]+" .beaconRSSI").html(result.rssi);
// 			        }
// 			        scanBeacon = {beacon_Name: name[0], beacon_rssi: result.rssi}; 
// 			        console.log("scanBeacon name: "+scanBeacon['beacon_Name']+" scanBeacon rssi: "+scanBeacon['beacon_rssi']);
// 			        /**
// 			         * 傳送beacon資料至server端php執行
// 			         */
// 			        //$.post("http://140.130.35.62/csie40343142/Tour_System_server/php/userScanBeacon.php",
// 			        //	scanBeacon, function(res){console.log(res)}, "json");
// 		        }
// 			    dataNum+=1;
// 			}
// 		},
// 		function(error){},{services: []});
// 	setTimeout(bluetoothle.stopScan, scanSeconds*1000, function(result){
// 		for(var i=0; i<10; i++){
// 			console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1");
// 		}
// 		$.ajax({
//         	url: "http://140.130.35.62/csie40343142/Tour_System_server/php/userScanBeacon.php",
//         	type: "POST",
//         	data: scanBeacon,
//         	success: function(result,status){
//         		console.log("asdasdasdasd: "+result);
//         		var a = JSON.parse(result);
//         		console.log("success: "+a.beacon_Name+" "+a.beacon_rssi+" status: "+status);
//         	},
//         	error: function(XMLHttpRequest, textStatus, errorThrown){
//         		console.log("XMLHttpRequest status:"+XMLHttpRequest.status);
//         		console.log("XMLHttpRequest readyStatus:"+XMLHttpRequest.readyState);
//         		console.log("textStatus:"+textStatus);
//         	}
//         });
// 	},function(error){});
// });




// 			}


// html += 	"<div class='ui-grid-b' style='height:150px;width:100%'>"+
// 							    "<div class='ui-block-a' style='height:100%;'>" + 
// 							    	"<div is='icon' style='width:100%; height:100%; position:relative'>" + 
// 								    	"<span class='ui-li-count' style='position:absolute; display:none; z-index:1; right:0; top:6px;'></span>" + 
// 								    	"<a href='#' class='ui-btn ui-mini ui-corner-all ui-shadow'" + 
// 								    	" style='display:block;margin:5px;height:50%;background-image: url(" + "image/data/" + items[i] + ".jpg); background-size: 95% 80%; background-position: 50% 50%; background-repeat: no-repeat no-repeat;'>" +
// 								    	"</a>" +
// 								    	"<div style='text-align:center;'>" + pagesIntrc[i] +"</div>" + 
// 							    	"</div>" +
// 							    "</div>";
// 							    if(i+1 >= items.length)
// 							    	break;
// 				html += 	    "<div class='ui-block-b' style='height:100%;'>" + 
// 							    	"<div is='icon' style='width:100%; height:100%; position:relative'>" +
// 								    	"<span class='ui-li-count' style='position:absolute; display:none; z-index:1; right:0; top:6px;'></span>" + 
// 								    	"<a href='#' class='ui-btn ui-mini ui-corner-all ui-shadow'" + 
// 								    	" style='display:block;margin:5px;height:50%;background-image: url(" + "image/data/" + items[i+1] + ".jpg); background-size: 95% 80%; background-position: 50% 50%; background-repeat: no-repeat no-repeat;'>" +
// 								    	"</a>" +
// 								    	"<div style='text-align:center;'>" +pagesIntrc[i+1] + "</div>" + 
// 							    	"</div>" +
// 							    "</div>";
// 							    if(i+2 >= items.length)
// 							    	break;
// 				html +=		    "<div class='ui-block-c' style='height:100%;'>" +
// 							    	"<div is='icon' style='width:100%; height:100%; position:relative'>" +
// 								    	"<span class='ui-li-count' style='position:absolute; display:none; z-index:1; right:0; top:6px;'></span>" +
// 								    	"<a href='#' class='ui-btn ui-mini ui-corner-all ui-shadow'" + 
// 								    	" style='display:block;margin:5px;height:50%;background-image: url(" + "image/data/" + items[i+2] + ".jpg); background-size: 95% 80%; background-position: 50% 50%; background-repeat: no-repeat no-repeat;'>" +
// 								    	"</a>" +
// 								    	"<div style='text-align:center;'>" + pagesIntrc[i+2] + "</div>" +
// 							    	"</div>" +
// 							    "</div>" +
// 						   "</div>";