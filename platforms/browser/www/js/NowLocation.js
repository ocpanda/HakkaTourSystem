/*
	儲存beacon資料陣列
*/
//beacon data object
var beaconData = [];
function addBeaconData(name, x, y){
	if(name === "config"){
		//如果傳入為config為設定config資料x欄為beacon數量y=0
		beaconData["config"] = {number: x, nameList: []};
	}
	else{
		beaconData[name] = {beaconLocX: x, beaconLocY: y, distance: 9999, pathloss:  2};//預設路徑衰減值為2
		addNameList(name);
	}

	//加入config nameList內容
	function addNameList(name){
		var add = 0;
		//檢查是名稱表內是否有一樣的名字
		for(var i=0; i<beaconData["config"].nameList.length; i++){
			if(beaconData["config"].nameList[i] == name){
				add = 1;
				break;
			}
		}
		if(add == 0){
			beaconData["config"].nameList.push(name);
		}
	}
}
function getBeaconData(){
	$.ajax({
		url: "http://140.130.35.62/csie40343142/Tour_System_server/php/TourGroupShowList.php",
		type: "POST",
		dataType: "json",
		success: function(result){
			//將目前展區beacon 位置資訊讀入
			
			//將beaconData陣列的config初始化(給定beacon數量)
			addBeaconData("config", result['beaconName'].length, 0);
			if(beaconData[config].number == result['beaconName'].length){
				for(var i=0; i<result['beaconName'].length; i++){
					addBeaconData(result['beaconName'], result['beaconLocX'], result['beaconLocY']);
				}
			}
			else{
				console.log("beacon number initialize error!");
			}
		},
		error: function(){
			console.log("get beacon data error!!");
		}
	});
}

/*
計算使用者與beacon距離並推算目前所在位置
 */
var fundDevices = [];
//建立fundDevices 的object
function addScanedBeacon(name, rssi){
	if(name === "config"){
		//fundDevices config, rssi為資料數量 
		fundDevices["config"] = {number: 0, nameList: []};
	}
	else{
		fundDevices[name] = {rssi: rssi};
		fundDevices["config"].number += 1;
		addNameList(name);
	}

	function addNameList(name){
		var add = 0;
		for(var i=0; i<fundDevices["config"].nameList.length; i++){
			if(fundDevices["config"].nameList[i] == name){
				add = 1;
				break;
			}
		}
		if(add == 0){
			fundDevices["config"].nameList.push(name);
		}
	}
}
var scanSeconds = 1; //每1秒執行一次
var calcLocation = {
	deviceScan: function(){
		bluetoothle.startScan(
			function(result){
				if(result.status === "scanStarted"){
					console.log("Scanning for devices!");
					addScanedBeacon("config", 0);
				}
				else if(result.status === "scanResult"){
					//掃描beacon
					
					if(fundDevices[result.name] != "undefined"){
						newData = 0;
						addScanedBeacon(result.name, result.rssi);
					}
					else{
						fundDevices["config"].number += 1;
						addScanedBeacon(result.name, result.rssi);
						//fundDevices.push(new ScanedBeacon(result.name, result.rssi));
					}
				}
				//開始計算距離
				this.startCalc(result.name ,fundDevices[result.name].rssi);
			},
			function(error){},{sercvices:[]});
	}

	startCalc: function(name, rssi){
		//計算使用者與各beacon距離
		beaconData[name].distance = calcDistance(rssi);
	}

	calcDistance: function(rssi){

	}
}