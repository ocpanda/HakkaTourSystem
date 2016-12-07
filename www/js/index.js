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
var fundDevices = [];
var scanSeconds = 3; //每3秒執行一次
var calcLocation = {
    /*show: function(){
        for(var i=0; i<6; i++)
            console.log("sssssssssssssssssssssss!!!!!!!!!!!!!!!!!!!!!!!!!!");
    },*/
    //建立fundDevices 的object
    addScanedBeacon: function(name, rssi){
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
    },
    deviceScan: function(){
        console.log("start scan!!!!!!!!!!!!!!!!!!!!!");
        bluetoothle.startScan(
            function(result){
                if(result.status === "scanStarted"){
                    console.log("Scanning for devices!");
                    calcLocation.addScanedBeacon("config", 0);
                }
                else if(result.status === "scanResult"){
                    //掃描beacon
                    
                    if(fundDevices[result.name] != "undefined"){
                        newData = 0;
                        calcLocation.addScanedBeacon(result.name, result.rssi);
                    }
                    else{
                        fundDevices["config"].number += 1;
                        calcLocation.addScanedBeacon(result.name, result.rssi);
                        //fundDevices.push(new ScanedBeacon(result.name, result.rssi));
                    }
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
            var temp = (-58.3 - fundDevices[fundDevices["config"].nameList[i]].rssi) / (10 * 3);
            console.log("calc!calc!calc!calc!calc!calc!calc!calc!calc!calc!calc!");
            console.log("name:"+fundDevices["config"].nameList[i]+" distance:"+Math.pow(10, temp));
            $("#asd").append("<p>"+"name:"+fundDevices["config"].nameList[i]+" distance:"+Math.pow(10, temp)+"</p>");   
            //beaconData[fundDevices["config"].nameList[i]].distance = Math.pow(10, temp);
        }
    }
}
//setInterval(calcLocation.deviceScan(), 3000);