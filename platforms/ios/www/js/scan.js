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
/**
 * Beacon data storage class
 */



var dataNum = 0;
var beaconDataStorage = new BeaconDataStorage();
var foundDevices = [];
var temp1;
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
			    else if (result.status === "scanResult") {
			        if (!foundDevices.some(function (device) {
			            return device.address === result.address;
			        })) {
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
				        var scanBeacon = {beacon_Name: name[0], beacon_rssi: result.rssi}; 
				        console.log("scanBeacon name: "+scanBeacon['beacon_Name']+" scanBeacon rssi: "+scanBeacon['beacon_rssi']);
				        temp1 = scanBeacon;
				        /**
				         * 傳送beacon資料至server端php執行
				         */
				        
				        /*$.ajax({
				        	url: "http://140.130.35.62/csie40343142/Tour_System_server/php/userScanBeacon.php",
				        	type: "POST",
				        	dataType: "json",
				        	data: scanBeacon,
				        	success: function(result){
				        		console.log("ajax transfer data success :" +result);
				        	},
				        	error: function(result){
				        		console.log("ajax transfer data failed :"+result);
				        	}
				        });*/
			        }
			        dataNum+=1;
			    }
			},
			function(error){},{services: []});

		setTimeout(bluetoothle.stopScan, scanSeconds*1000, function(result){
			$.post("http://140.130.35.62/csie40343142/Tour_System_server/php/userScanBeacon.php",
				        	temp1, function(res){console.log("res")}, "json");
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
	}

	/*deviceStopScan: function(){
		console.log("stop scan!");
		ble.stopScan(
			function(){console.log("stop scan!");},
			function(){console.log("stop scan faild!");});
	}*/
}
scanapp.goScan();