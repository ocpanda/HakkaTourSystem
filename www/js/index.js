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
        this.bindEvents(); // 2 初始化
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
            app.addUser(data);
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
    gocalc: function(){//3 初始化完成後跑到calcLocation這個物件的deviceScan
        setInterval(calcLocation.deviceScan, 3000);
        //setInterval(calcLocation.show, 2000);
    },
    /*
    code by C.H Chiang
    function: addUset> 將使用者UUID傳至server紀錄是否已使用過此APP
    input: 使用者UUID
    output: null
    use: app.addUser(UUID)
    */
    addUser: function(data){
      console.log(data);
      $.ajax({
          url:"http://140.130.35.62/hakka/Tour_System_server/php/TourGetMobileUUID.php",
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
};
app.initialize();



/*
計算使用者與beacon距離並推算目前所在位置
 */
var text = [];  //存放beacon測試資料 距離,RSS,time
var calcRec = [];
var fundDevices = [];
var beaconData = [];
var scanSeconds = 3; //每3秒執行一次
var startTime = new Date().getTime();
var endTime = 0;
var switcher = 0;
/*
code by C.H Chiang
class: 紀錄beacon位置資訊及計算出beacon與使用者之距離
*/
var calcLocation = {
    /*
    code by C.H Chiang
    function: addData> 建立紀錄scan後計算的距離(測試用功能)
    input: beacon識別碼, 距離, 信號強度, 取得資料時間
    output: text
    use: calcLocation.addData(name, distance, rss, time)
    */
    addData: function(name, distance, rss, time){
      if(text[name] == undefined){
        text[name] = {data: []};
      }
      text[name].data.push("<a>距離:"+distance.toFixed(4)+" RSS:"+rss+" 取得時間:"+time+"sec</a><br>") //16 加進陣列
    },
    /*
    code by C.H Chiang
    function: addScanedCalc> 建立紀錄scan後計算的距離以及計算整體平均值
    input: beacon識別碼, 距離, 信號強度
    output: calcRec
    use: calcLocation.addScanedCalc(name, distance, rss)
    */
    addScanedCalc: function(name, distance, rss){// 14 here
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
        calcLocation.addData(name,distance,rss,((endTime-startTime)/1000)); //  15  將設備名稱 距離 強度 執行時間加進陣列

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
    /*
    code by C.H Chiang
    function: addScanedBeacon> 建立紀錄掃描到的beacon資訊
    input: beacon識別碼, 信號強度
    output: fundDevices
    use: calcLocation.addScanedBeacon(name, rss)
    */
    addScanedBeacon: function(name, rssi){
        if(name === "config"){
            //addScanedBeacon config動作, rssi為資料數量
            if(fundDevices["config"] == undefined){
              fundDevices["config"] = {number: 0, nameList: []};   //主要紀錄名稱在這個config 的nameList裡面
            }
        }
        else{
          if(fundDevices[name] == undefined){
            /*
            code by C.H Chiang
            以下為測試用功能
            */
            $("#bdata").append("<li><a id='"+name+"' class='showData'>"+name+"</a></li>");
            $(".showData").click("click", function(){
              var id = $(this).attr("id");
              calcLocation.showDataWin(id);
            });
            //到此為測試用功能
            fundDevices["config"].number += 1;
            addNameList(name);
          }
          fundDevices[name] = {rssi: rssi};   //不管怎樣都會執行這段
        }

        function addNameList(name){
          fundDevices["config"].nameList.push(name);
        }
    },
    /*
    code by C.H Chiang
    function: addBeaconData> 取得場館beacon資訊後將其加入倒beaconData
    input: beacon識別碼, beacon位置x, beacon位置y
    output: beaconData
    use: calcLocation.addBeaconData(name, x, y)
    */
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
    /*
    code by C.H Chiang
    function: getBeaconData> 取得場館beacon資訊
    input: null
    output: null
    use: calcLocation.getBeaconData()
    */
    getBeaconData: function(){
        $.ajax({
            url: "http://140.130.35.62/hakka/Tour_System_server/php/TourGroupShowList.php",
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
    },
    /*
    code by C.H Chiang
    以下為測試用功能
    */
    showDataWin: function(name){ // 9 點擊後執行這個
      $("#dataMsg").popup("open", {transition: "pop"});
      $("#devicedd").html(name);
      for(var i=0; i<text[name].data.length; i++){
        $("#dataPopupMsg").append(text[name].data[i]); // 10 他會跳出html裡面定義好的視窗
      }
    },
    /*
    code by C.H Chiang
    function: deviceScan> 掃描藍芽
    input: null
    output: null
    use: calcLocation.deviceScan()
    */
    deviceScan: function(){ //4 這裡 這段掃描藍芽
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
                  //var name1 = result.name.replace(/(\W+)/g, "");
                  var name = result.address.replace(/(\W+)/g, "");
                  //alert(name);
                  calcLocation.addScanedBeacon(name, result.rssi);
                }
            },
            function(error){},{sercvices:[]});
        setTimeout(bluetoothle.stopScan, 1500, function(){
            //開始計算距離
            calcLocation.startCalc();
        });
    },
    /*
    code by C.H Chiang
    function: startCalc> 計算使用者與beacon距離
    input: null
    output: null
    use: calcLocation.addScanedBeacon()
    */
    startCalc: function(){
        //計算使用者與各beacon距離
        for(var i=0; i<fundDevices["config"].nameList.length; i++){
            var beaconName = fundDevices["config"].nameList[i];
            var rss = fundDevices[fundDevices["config"].nameList[i]].rssi;
            var temp = (-58.3 - rss) / (10 * 5);
            var temp2 = Math.pow(10, temp);

            calcLocation.addScanedCalc(beaconName, temp2, 0);

            /*
            code by C.H Chiang
            以下為測試用功能
            測試功能起始點 觸發為 calcLocation.addScanedCalc("calcAvg", beaconName, rss);
            影響index.html <div id=dsa>
            */
            var beaconNum = fundDevices["config"].nameList.indexOf(beaconName);
            if($("#beacon"+beaconNum).length > 0){
              $("#beacon"+beaconNum).html("與"+beaconName+"平均距離："+calcLocation.addScanedCalc("calcAvg", beaconName, rss).toFixed(4));
            }
            else{
              $("#dsa").append("<a id='beacon"+beaconNum+"'>"+"與"+beaconName+"平均距離："+calcLocation.addScanedCalc("calcAvg", beaconName, rss).toFixed(4)+"</a><br>");
            }
            $("#bdata").listview("refresh");
            //測試功能到此為止
        }
    }
}

/*
code by C.H Chiang
class: 使用高斯消去法將beacon的RSS誤差值給消去 計算最小誤差值
aj=xj-x1, bj=yj-y1, cj=aj+bj-(dj^2-d1^2)
variables: gaussianProcessData用於高斯演算法
                s 為最終計算使用者位置結果x,y
                h = |a1  b1|
                    |.   . |
                    |an  bn|
                q = |c1|
                    |. |
                    |cn|
*/
var gaussianProcessData = [];
var GaussianElimination={
  addData: function(name){
    if(name === "config"){
      if(gaussianProcessData == undefined){
        gaussianProcessData["config"] = {s: [], h: [],, q:[]};
      }
    }
    else{
        gaussianProcessData[name].h[0].push();
    }
  },
  getData: function(){

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
