/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var deviceID = device.uuid;
        var devicePlatform = device.platform;
        if(devicePlatform == "browser"){
            deviceID = "Test-Device";
        }
        //localStorage.removeItem("deviceID");
        if(deviceID != localStorage.getItem("deviceID")){
            console.log("change deviceID");
            localStorage.setItem("deviceID", deviceID);
            var data={deviceID: localStorage.getItem("deviceID")};
            addUser(data);
        }

        /*紀錄app登入次數  上線將下方註解拿掉即可使用*/
        /*$.ajax({
            url: "http://140.115.197.16/",
            type: "GET",
            data: "school=nfu&app=test",
            dataType: "jsonp",
            jsonp: "callback",
            success: function(json,textStatus){
                console.log("jsonp.success:"+json.name);
            },
            error: function(XMLHttpRequest,textStatus,errorThrown){
                console.log("jsonp.error:"+textStatus);
            }
        });*/

        console.log("Bluetooth initialize");
        bluetoothle.initialize(function(result){
            console.log("bluetooth adapter status: "+result.status);
        }, { request: true, statusReceiver: false });
        app.gocalc();
    },
    gocalc: function(){
        setInterval(calcLocation.deviceScan, 3000);
        //setInterval(calcLocation.show, 2000);
    }
};
app.initialize();

//將使用者UUID傳至server
function addUser(data){
    console.log(data);
    $.ajax({
        url:"http://140.130.35.62/csie40343142/Tour_System_server/php/TourGetMobileUUID.php",
        type: "POST",
        data: data,
        dataType: "text",
        success: function(result){
            console.log(result);
        },
        error: function(){
            console.log("使用者加入失敗!");
        }
    });
}

/*
計算使用者與beacon距離並推算目前所在位置
 */
var calcRec = [];
var fundDevices = [];
var scanSeconds = 3; //每3秒執行一次
var startTime = new Date().getTime();
var endTime = 0;
var calcLocation = {
    /*show: function(){
        for(var i=0; i<6; i++)
            console.log("sssssssssssssssssssssss!!!!!!!!!!!!!!!!!!!!!!!!!!");
    },*/
    //建立紀錄scan後計算距離的object
    addScanedCalc: function(name, distance, rss){
      if(name === "config"){
        if(calcRec["config"] == undefined){
          calcRec["config"] = {number: 0, nameList: []};
        }
      }
      else if(name === "calcAvg"){
        //addScanedCalc calcAvg動作, name維動作 distance為beacon名稱
        return avgDistance(distance);
      }
      else{
        if(calcRec[name] == undefined){
          addNameList(name);
          calcRec["config"].number += 1;
        }
        endTime = new Date().getTime();
        $("#ul"+name).append("<li><a>距離:"+distance+" RSS:"+rss+" 取得時間:"+((endTime-startTime)/1000)+"sec</a></li>");
        $("#ul"+name).listview("refresh");
        calcRec[name].distance.push(distance);
      }

      function addNameList(name){
        calcRec[name] = {distance: []};
        calcRec["config"].nameList.push(name);
      }

      function avgDistance(name){
        var total = 0;
        for(var i=0; i<calcRec[name].distance.length; i++){
          total += calcRec[name].distance[i];
        }
        return total / calcRec[name].distance.length;
      }
    },
    //建立fundDevices 的object
    addScanedBeacon: function(name, rssi){
        if(name === "config"){
            //addScanedBeacon config動作, rssi為資料數量
            if(fundDevices["config"] == undefined){
              fundDevices["config"] = {number: 0, nameList: []};
            }
        }
        else{
          if(fundDevices[name] == undefined){
            $("#asd").append("<div data-role='collapsible' id='"+name+"'></div>");
            $("#"+name).append("<ul data-role='listview' id='ul"+name+"'></ul>");
            $( "#"+name).collapsibleset( "refresh" );
            fundDevices["config"].number += 1;
            addNameList(name);
          }
          fundDevices[name] = {rssi: rssi};
        }

        function addNameList(name){
          fundDevices["config"].nameList.push(name);
        }
    },
    deviceScan: function(){
        console.log("start scan!!!!!!!!!!!!!!!!!!!!!");
        bluetoothle.startScan(
            function(result){
                if(result.status === "scanStarted"){
                    console.log("Scanning for devices!");
                    calcLocation.addScanedBeacon("config", 0);
                    calcLocation.addScanedCalc("config", 0);
                }
                else if(result.status === "scanResult"){
                  //掃描beacon
                  calcLocation.addScanedBeacon(result.name, result.rssi);
                }
            },
            function(error){},{sercvices:[]});
        setTimeout(bluetoothle.stopScan, 1500, function(){
            //開始計算距離
            calcLocation.startCalc();
        });
    },
    startCalc: function(){
        //計算使用者與各beacon距離
        for(var i=0; i<fundDevices["config"].nameList.length; i++){
            var beaconName = fundDevices["config"].nameList[i];
            var RSS = fundDevices[fundDevices["config"].nameList[i]].rssi;
            var temp = (-58.3 - RSS) / (10 * 5);
            var temp2 = Math.pow(10, temp);

            calcLocation.addScanedCalc(beaconName, temp2);
            $("#"+name).append("<p>與"+beaconName+"平均距離："+calcLocation.addScanedCalc("calcAvg",beaconName, RSS)+"</p>");
            /*console.log("calc!calc!calc!calc!calc!calc!calc!calc!calc!calc!calc!");
            console.log("name:"+fundDevices["config"].nameList[i]+" distance:"+Math.pow(10, temp)+" rss:"+fundDevices[fundDevices["config"].nameList[i]].rssi);
            $("#asd").append("<p>"+"name:"+fundDevices["config"].nameList[i]+" distance:"+calcLocation.addScanedCalc("calcAvg",fundDevices["config"].nameList[i])+" rss:"+fundDevices[fundDevices["config"].nameList[i]].rssi+"</p>");*/
            //beaconData[fundDevices["config"].nameList[i]].distance = Math.pow(10, temp);
        }
    }
}
//setInterval(calcLocation.deviceScan(), 3000);
//
/*
    儲存beacon資料陣列 拿取展物位置資訊
*/
//beacon data object
/*var beaconData = [];
var getItemData = {
    addBeaconData: function(name, x, y){
        if(name === "config"){
            //如果傳入為config為設定config資料x欄為beacon數量y=0
            beaconData["config"] = {number: x, nameList: []};
        }
        else{
            beaconData[name] = {beaconLocX: x, beaconLocY: y, distance: 9999};
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
    },
    getBeaconData: function(){
        $.ajax({
            url: "http://140.130.35.62/csie40343142/Tour_System_server/php/TourGroupShowList.php",
            type: "POST",
            dataType: "json",
            success: function(result){
                //將目前展區beacon 位置資訊讀入
                //將beaconData陣列的config初始化(給定beacon數量)
                this.addBeaconData("config", result['beaconName'].length, 0);
                if(beaconData[config].number == result['beaconName'].length){
                    for(var i=0; i<result['beaconName'].length; i++){
                        this.addBeaconData(result['beaconName'], result['beaconLocX'], result['beaconLocY']);
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
}*/
