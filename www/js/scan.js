/**
 * Beacon data storage class
 * use for local storage
 * call this class to put your data into local storage
 */

var items = ["table", "chair", "mouse","anglee"];
var pagesIntrc = ["桌子", "椅子", "滑鼠", "安哥"];

var pages = ["#pageOne", "#pageTwo"];
var nowPage = 0;


var endl = "'>";

var html = "";




var dataNum = 0;
var beaconDataStorage = new BeaconDataStorage();
var foundDevices = [];
var scanBeacon;

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
/**
 * Beacon data storage class
 */

var scanapp = {
	goScan: function(){
		this.bindEvents();
	},
	/**
	 * [bindEvents description]
	 * define event listener
	 * @return {[type]} [description]
	 * no return
	 */
	bindEvents: function(){
		//start scan listener button DOM id=scanBtn
		var scanBtn = document.getElementById("scanBtn");
		scanBtn.addEventListener('click', this.deviceScan, false);
		var goPageOne = document.getElementById("goPageOne");
		goPageOne.addEventListener('click', this.hide, false);
		var goPageTwo = document.getElementById("goPageTwo");
		goPageTwo.addEventListener('click', this.showPage, false);
		var pageTwo = document.getElementById('pageTwo');
		pageTopBKColorInit();
		pageRender();
		$("#pageOne").show();
		//stop scan listener button DOM id=stopScanBtn
		//var stopScanBtn = document.getElementById("stopScanBtn");
		//stopScanBtn.addEventListener('click', this.deviceStopScan, false);
	},

	deviceScan: function(){
		var scanSeconds = 5;
		foundDevices = [];
		console.log("scanning!");
		bluetoothle.startScan(
			function(result){
				console.log("scan status "+result.status);
				if (result.status === "scanStarted") {
			        console.log("Scanning for devices");
			    }
			    else if (result.status === "scanResult") 
			    {
			        if (!foundDevices.some(function (device) {
			            return device.address === result.address;
			        })) 
			        {
			            console.log("FOUND DEVICE:");
			            var name = new Array();
			            var name = result.name.toString().split(" ");
			            console.log(name[0]);
			            console.log($("#my"+name[0]).length);
			            if($("#my"+name[0]).length === 0){
				            $("#scanData").append("<tr id=my"+name[0]+">"+
								"<th class='beaconName'>"+result.name+"</th>"+
								"<th class='beaconUUID'>"+result.address+"</th>"+
								"<th class='beaconRSSI'>"+result.rssi+"</th>"+"</tr>");
				            console.log("dataNum: "+dataNum);
				            console.log($("#my"+name[0]).length);
				        }
				        else{
				        	console.log("change rssi");
				        	$("#my"+name[0]+" .beaconRSSI").html(result.rssi);
				        }
				        scanBeacon = {beacon_Name: name[0], beacon_rssi: result.rssi}; 
				        console.log("scanBeacon name: "+scanBeacon['beacon_Name']+" scanBeacon rssi: "+scanBeacon['beacon_rssi']);
				        /**
				         * 傳送beacon資料至server端php執行
				         */
				        //$.post("http://140.130.35.62/csie40343142/Tour_System_server/php/userScanBeacon.php",
				        //	scanBeacon, function(res){console.log(res)}, "json");
			        }
				    dataNum+=1;
				}
			},
			function(error){},{services: []});
		setTimeout(bluetoothle.stopScan, scanSeconds*1000, function(result){
			for(var i=0; i<10; i++){
				console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1");
			}
			$.ajax({
	        	url: "http://140.130.35.62/csie40343142/Tour_System_server/php/userScanBeacon.php",
	        	type: "POST",
	        	data: scanBeacon,
	        	success: function(result,status){
	        		console.log("asdasdasdasd: "+result);
	        		var a = JSON.parse(result);
	        		console.log("success: "+a.beacon_Name+" "+a.beacon_rssi+" status: "+status);
	        	},
	        	error: function(XMLHttpRequest, textStatus, errorThrown){
	        		console.log("XMLHttpRequest status:"+XMLHttpRequest.status);
	        		console.log("XMLHttpRequest readyStatus:"+XMLHttpRequest.readyState);
	        		console.log("textStatus:"+textStatus);
	        	}
	        });
		},function(error){});
		
		/*ble.startScan([], function(device){
			console.log("here is scan device!");
			//document.body.removeChild(document.getElementById("error"));
			var obj = JSON.parse(JSON.stringify(device));
			console.log(obj);
			var beaconData = new BeaconDataProperty(obj.id.toString(), obj.name.toString(), obj.rssi.toString());
			//beaconDataStorage.setData(beaconData.UUID, beaconData);
			$("#scanData").append("<tr>"+
						"<th>"+  (dataNum+1)  +"</th>"+
						"<th>"+beaconData.name+"</th>"+
						"<th>"+beaconData.UUID+"</th>"+
						"<th>"+beaconData.rssi+"</tr>");
			
		},function(reason){
			console.log("doesn't scan devices!");
			console.log(reason);
			$(document.body).append("<p id='error'>scan faild!</p>");
		});*/

		/*setTimeout(ble.stopScan, scanSeconds*1000,
			function(){
				console.log("Scan complete");
			},
			function(){
				console.log("stopScan faild");
			});*/
	},

	showPage: function() {
		pageTopBKColorInit();
		pageRender();
		htmlShow();
		if(nowPage == 1)
			for(var i = 0 ; i < items.length ; i+=3)
			{
				 // html += "<img class='searchImgLeft' src='" + "image/data/" + items[i] + ".jpg" + endl + 
				 // 		"<img class='searchImgMiddle' src='" + "image/data/" + items[i+1] + ".jpg" + endl +
				 // 		"<img class='searchImgRight' src='" + "image/data/" + items[i+2] + ".jpg" + endl + "<br />" +
				 // 		"<span class='searchTextLeft'>" + pagesIntrc[i] + "</span>" +
				 // 		"<span class='searchTextMiddle'>" +  pagesIntrc[i+1] + "</span>" + 
				 // 		"<span class='searchTextRight'>" + pagesIntrc[i+2] + "</span>" ;
				html += 	"<div class='ui-grid-b' style='height:150px;width:100%'>"+
							    "<div class='ui-block-a' style='height:100%;'>" + 
							    	"<div is='icon' style='width:100%; height:100%; position:relative'>" + 
								    	"<span class='ui-li-count' style='position:absolute; display:none; z-index:1; right:0; top:6px;'></span>" + 
								    	"<a href='#' class='ui-btn ui-mini ui-corner-all ui-shadow'" + 
								    	" style='display:block;margin:5px;height:50%;background-image: url(" + "image/data/" + items[i] + ".jpg); background-size: 95% 80%; background-position: 50% 50%; background-repeat: no-repeat no-repeat;'>" +
								    	"</a>" +
								    	"<div style='text-align:center;'>" + pagesIntrc[i] +"</div>" + 
							    	"</div>" +
							    "</div>";
							    if(i+1 >= items.length)
							    	break;
				html += 	    "<div class='ui-block-b' style='height:100%;'>" + 
							    	"<div is='icon' style='width:100%; height:100%; position:relative'>" +
								    	"<span class='ui-li-count' style='position:absolute; display:none; z-index:1; right:0; top:6px;'></span>" + 
								    	"<a href='#' class='ui-btn ui-mini ui-corner-all ui-shadow'" + 
								    	" style='display:block;margin:5px;height:50%;background-image: url(" + "image/data/" + items[i+1] + ".jpg); background-size: 95% 80%; background-position: 50% 50%; background-repeat: no-repeat no-repeat;'>" +
								    	"</a>" +
								    	"<div style='text-align:center;'>" +pagesIntrc[i+1] + "</div>" + 
							    	"</div>" +
							    "</div>";
							    if(i+2 >= items.length)
							    	break;
				html +=		    "<div class='ui-block-c' style='height:100%;'>" +
							    	"<div is='icon' style='width:100%; height:100%; position:relative'>" +
								    	"<span class='ui-li-count' style='position:absolute; display:none; z-index:1; right:0; top:6px;'></span>" +
								    	"<a href='#' class='ui-btn ui-mini ui-corner-all ui-shadow'" + 
								    	" style='display:block;margin:5px;height:50%;background-image: url(" + "image/data/" + items[i+2] + ".jpg); background-size: 95% 80%; background-position: 50% 50%; background-repeat: no-repeat no-repeat;'>" +
								    	"</a>" +
								    	"<div style='text-align:center;'>" + pagesIntrc[i+2] + "</div>" +
							    	"</div>" +
							    "</div>" +
						   "</div>";
			}
		nowPage = 1;
		pageTwo.innerHTML = html;
	},
	hide: function() {
		pageTwo.innerHTML = "";
		html = "";
		nowPage = 0;
		pageTopBKColorInit();
		pageRender();
		htmlShow();
	}

	/*deviceStopScan: function(){
		console.log("stop scan!");
		ble.stopScan(
			function(){console.log("stop scan!");},
			function(){console.log("stop scan faild!");});
	}*/
}
scanapp.goScan();