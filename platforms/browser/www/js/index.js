<<<<<<< HEAD
//-------------------------------------------------
//Code: C.H Chiang 蔣政樺
//function: 藍牙室內定位 方法 RSS whit 高斯消去法
//-vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv-
/*app 設定資料*/
var calcRec = [];       //
var fundDevices = [];
var beaconData = [];
var recordClacTime = 0; //記錄目前計算過幾次距離
var myVar;
var addData = {
  /*
  code by C.H Chiang
  function: addUser> 將使用者UUID傳至server紀錄是否已使用過此APP
  input: 使用者UUID
  output: null
  use: addData.addUser(UUID)
  */
  addUser: function(data){
    console.log(data);
      $.ajax({
        url:"http://140.130.35.62/hakka/hakkamanager/php/TourGetMobileUUID.php",
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
  },
  /*
  code by C.H Chiang
  function: addScanedCalc> 建立紀錄scan後計算的距離以及計算整體平均值
  input: beacon識別碼, 距離, 信號強度
  output: calcRec
  use: addData.addScanedCalc(name, distance, rss)
  */
  addScanedCalc: function(name, distance, rss){
    if(name === "config"){
      if(calcRec["config"] == undefined){
        calcRec["config"] = {number: 0, nameList: []};
      }
    }else if(name === "calcAvg"){
      return avgDistance(distance);
    }else{
      if(calcRec[name] == undefined)
        addNameList(name);
      if(calcRec[name].distance.length >= 5){
        calcRec[name].distance.splice(recordClacTime, 1, distance);
        recordClacTime = 0;
      }else{
=======
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
document.addEventListener("pause", onPause, false);
var myVar;
function onPause() {
    // Handle the pause event
    console.log('exitexitexitexitexitexitexitexitexitexitexitexit');
    clearInterval(myVar);
}

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
<<<<<<< HEAD
            success: function(json,textStatus){    
                console.log("jsonp.success:"+json.name);    
            },    
            error: function(XMLHttpRequest,textStatus,errorThrown){    
                console.log("jsonp.error:"+textStatus);    
=======
            success: function(json,textStatus){
                console.log("jsonp.success:"+json.name);
            },
            error: function(XMLHttpRequest,textStatus,errorThrown){
                console.log("jsonp.error:"+textStatus);
>>>>>>> calc_location
            }
        });*/

        console.log("Bluetooth initialize");
        bluetoothle.initialize(function(result){
            console.log("bluetooth adapter status: "+result.status);
        }, { request: true, statusReceiver: false });
        app.gocalc();
    },
    gocalc: function(){//3 初始化完成後跑到calcLocation這個物件的deviceScan
      calcLocation.main();
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
    function: main> calcLocation程式切入點
    input: null
    output: null
    use: calcLocation.main()
    */
    main: function(){
      //先進行展區beacon資料的初始化
      calcLocation.getBeaconData();
      myVar = setInterval(calcLocation.deviceScan, 3000);
    },
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

>>>>>>> release/debugSearch
        calcRec[name].distance.push(distance);
      }
    }

    function addNameList(name){
      calcRec[name] = {distance: []};
      calcRec["config"].nameList.push(name);
      calcRec["config"].number += 1;
    }

    function avgDistance(name){
      var total = 0;
      var length = calcRec[name].distance.length;
      for(var i=0; i<length; i++){
        total += calcRec[name].distance[i];
      }
      return total / length;
    }
  },
  /*
  code by C.H Chiang
  function: addScanedBeacon> 建立紀錄掃描到的beacon資訊
  input: beacon識別碼, 信號強度
  output: fundDevices
  use: addData.addScanedBeacon(name, rss)
  */
  addScanedBeacon: function(name, rssi){
    if(name === "config"){
      console.log("addScanedBeacon use config");
      if(fundDevices["config"] == undefined)
        fundDevices["config"] = {number: 0, nameList: []};
    }else{
      console.log("addScanedBeacon use name");
      if(fundDevices[name] == undefined){
        fundDevices["config"].number += 1;
        addNameList(name);
      }
      fundDevices[name] = {rssi: rssi};
    }

    function addNameList(name){
      fundDevices["config"].nameList.push(name);
    }
  },
  /*
  code by C.H Chiang
  function: addBeaconData> 取得場館beacon資訊後將其加入到beaconData
  input: beacon識別碼, beacon位置x, beacon位置y
  output: beaconData
  use: addData.addBeaconData(name, x, y)
  */
  addBeaconData: function(name, x, y, dist){
    if(name === "config"){
      beaconData["config"] = {number: 0, nameList: []};
    }else{
      addNameList(name);
      beaconData[name] = {beaconLocX: x, beaconLocY: y, distance: dist};
    }

    function addNameList(name){
      if(beaconData[name] === undefined){
        beaconData["config"].nameList.push(name);
        beaconData["config"].number++;
      } 
    }
  }
};

var getData = {
  /*
  code by C.H Chiang
  function: getBeaconData> 取得場館beacon資訊
  input: null
  output: null
  use: getData.getBeaconData()
  */
  getBeaconData: function(){
    if(beaconData["config"] === undefined)
      addData.addBeaconData("config", 0, 0, 0);
    $.ajax({
      url: "http://140.130.35.62/hakka/hakkamanager/php/TourGetBeaconData.php",
      type: "POST",
      dataType: "json",
      success: function(result){
        for(var i=0; i<result['uuid'].length; i++){
          addData.addBeaconData(result['uuid'][i], result['locationX'][i], result['locationY'][i], 0);
          console.log("add beacon:" + result['uuid'][i] + "  X:"+result['locationX'][i] + "  Y:"+result['locationY'][i]);
        }
      },
      error: function(){
        console.log("get beacon data error!!");
      }
<<<<<<< HEAD
    });
  }
};

var calcLocation = {
  /*
  code by C.H Chiang
  function: main> calcLocation程式切入點
  input: null
  output: null
  use: calcLocation.main()
  */
  main: function(){
    getData.getBeaconData();  //取得場館beacon位置資訊
    myVar = setInterval(calcLocation.deviceScan, 400);
  },
  deviceScan: function(){
    console.log("start scan!");
    bluetoothle.startScan(
      function(result){
        if(result.status === "scanStarted"){
          console.log("Scanning for devices");
          addData.addScanedBeacon("config", 0);
          addData.addScanedCalc("config", 0);
        }
        else if(result.status === "scanResult"){
          console.log("Scanning result "+name+" "+result.rssi);
          var name = result.address.replace(/(\W+)/g, "");
          for(var i=0; i<beaconData["config"].number; i++){
            if(beaconData["config"].nameList.indexOf(name) >= 0){
              console.log("replaced address name "+name);
              addData.addScanedBeacon(name, result.rssi);
            }
          }
=======
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
>>>>>>> release/debugSearch
        }
      },
    function(error){
      console.log("scan error! "+error.error+" "+error.message); 
      return;
    }, {sercvices: []});
    //setTimeout(bluetoothle.stopScan, 200, function(){
      //開始計算距離
      calcLocation.startCalc();         
    //});
    
  },
  /*
  code by C.H Chiang
  function: startCalc> 計算使用者與beacon距離
  input: null
  output: null
  use: calcLocation.startCalc()
  */
  startCalc: function(){
    console. log("start calc called!!!");
    //計算使用者與各beacon距離
    for(var i=0; i<fundDevices["config"].number; i++){
      var beaconName = fundDevices["config"].nameList[i];
      var rss = fundDevices[fundDevices["config"].nameList[i]].rssi;
      console.log("beaconName:"+beaconName+" rss:"+rss);
      //(一公尺RSS強度 - 目前接收RSS強度) / (10 * 路徑衰減函數)
      var temp = (-58.3 - rss) / (10 * 9.5);
      var temp2 = Math.pow(10, temp);
      addData.addBeaconData(beaconName, beaconData[beaconName].beaconLocX, beaconData[beaconName].beaconLocY, temp2);
    }
    GaussianElimination.main();
  }
};

/*
code by C.H Chiang
class: 使用高斯消去法將beacon的RSS誤差值給消去 計算最小誤差值
aj=xj-x1, bj=yj-y1, cj=aj+bj-(dj^2-d1^2)
variables: gaussianProcessData用於高斯演算法
                s 為最終計算使用者位置結果x,y
                a = |a1  b1 c1|
                    |.   .  . |
                    |an  bn cn|
*/
var x1 = 0, y1 = 0;
var gaussianProcessData = [];
var GaussianElimination = {
  main: function(){
    GaussianElimination.getData();
  },
  /*
  code by C.H Chiang
  function: addData> 將高斯消去法之s,h,q矩陣加入資料
  input: beaconName
  output: null
  use: GaussianElimination.addData(beaconName)
  */
  addData: function(name){
    //由aj bj cj 組合為一個a陣列 給高斯演算法做計算
    console.log("oriaddData "+beaconData["config"].nameList[0]);
    console.log("orilocationX "+beaconData[beaconData["config"].nameList[0]].beaconLocX);
    console.log("orilocationY "+beaconData[beaconData["config"].nameList[0]].beaconLocY);      
    console.log("orildis "+beaconData[beaconData["config"].nameList[0]].distance);
    console.log("addData "+name);
    console.log("locationX "+beaconData[name].beaconLocX);
    console.log("locationY "+beaconData[name].beaconLocY);      
    console.log("dis "+beaconData[name].distance);
    if(name != beaconData["config"].nameList[0]){
      var aj = beaconData[name].beaconLocX - beaconData[beaconData["config"].nameList[0]].beaconLocX;
      var bj = beaconData[name].beaconLocY - beaconData[beaconData["config"].nameList[0]].beaconLocY;
      var cj = (aj + bj - (Math.pow(beaconData[name].distance, 2.0)-Math.pow(beaconData[beaconData["config"].nameList[0]].distance, 2.0)));
      console.log("this is aj = "+aj);
      console.log("this is bj = "+bj);
      console.log("this is cj = "+cj);
      //a[0]為a1~an, a[1]為b1~bn, a[2]為c1~cn
      gaussianProcessData["config"].a.push([aj,bj]);
      gaussianProcessData["config"].s.push(cj);
    }
  },
  /*
  code by C.H Chiang
  function: getData> 以beaconName依序 將資料加入高斯演算法資料陣列
  input: null
  output: null
  use: GaussianElimination.getData()
  */
  getData: function(){
    // console.log("getData called!!!!");
    // console.log("beacondata number : "+beaconData["config"].number);
    if(gaussianProcessData["config"] == undefined){
      console.log("config created!");
      gaussianProcessData["config"] = {s: [], a: []};
    }
    if(beaconData["config"].number >= 3){
      for(var i=1; i<beaconData["config"].number; i++){
        GaussianElimination.addData(beaconData["config"].nameList[i]);
      }
      console.log("realy calc!!!!!!!!!!!");
      console.log(gaussianProcessData["config"].a);
      gaussianProcessData["config"].s = GaussianElimination.gaussianCalc(gaussianProcessData["config"].a, gaussianProcessData["config"].s);
      console.log("calc complete!!");
      console.log(gaussianProcessData["config"].s);
      console.log(parseFloat(gaussianProcessData["config"].s[0])+" "+parseFloat(gaussianProcessData["config"].s[1]));
      updateMap();
        
      // }
      // else{
      //   $("#dsa").append("<a id='gauss'>X："+gaussianProcessData["config"].s[0]+"  Y："+gaussianProcessData["config"].s[1]+"</a><br>");
      //   // $("#dsa").append("<a>aaaaaaaa</a>");
      // }
      gaussianProcessData["config"].s.length = 0;
      gaussianProcessData["config"].a.length = 0;
      //console.log(gaussianProcessData["config"].s);
    }else{
      gaussianProcessData["config"].s.length = 0;
      gaussianProcessData["config"].a.length = 0;
    }
  },
  gaussianCalc: function(A, x){
    var abs = Math.abs;
    /**
     * Gaussian elimination
     * @param  array A matrix
     * @param  array x vector
     * @return array x solution vector
     */
    var i, k, j;
    // Just make a single matrix
    for (i=0; i < A.length; i++) { 
      console.log("number "+i+" push array!");
      A[i].push(x[i]);
    }
    var n = A.length;
    for (i=0; i < n; i++) { 
        // Search for maximum in this column
        var maxEl = abs(A[i][i]),
            maxRow = i;
        for (k=i+1; k < n; k++) { 
            if (abs(A[k][i]) > maxEl) {
                maxEl = abs(A[k][i]);
                maxRow = k;
            }
        }
<<<<<<< HEAD
        // Swap maximum row with current row (column by column)
        for (k=i; k < n+1; k++) { 
            var tmp = A[maxRow][k];
            A[maxRow][k] = A[i][k];
            A[i][k] = tmp;
        }
        // Make all rows below this one 0 in current column
        for (k=i+1; k < n; k++) { 
            var c = -A[k][i]/A[i][i];
            for (j=i; j < n+1; j++) { 
                if (i===j) {
                    A[k][j] = 0;
                } else {
                    A[k][j] += c * A[i][j];
                }
            }
        }
    }
    // Solve equation Ax=b for an upper triangular matrix A
    x = this.arrayFill(0, n, 0);
    for (i=n-1; i >= 0; i--) { 
        x[i] = A[i][n]/A[i][i];
        for (k=i-1; k >= 0; k--) { 
            A[k][n] -= A[k][i] * x[i];
=======
    },
    /*
    code by C.H Chiang
    function: addBeaconData> 取得場館beacon資訊後將其加入倒beaconData
    input: beacon識別碼, beacon位置x, beacon位置y
    output: beaconData
    use: calcLocation.addBeaconData(name, x, y)
    */
    addBeaconData: function(name, x, y){
        console.log("inside:"+x+" "+y);
        if(name === "config"){
            //如果傳入為config為設定config資料x欄為beacon數量y=0
            beaconData["config"] = {number: 0, nameList: []};
        }
        else{
            beaconData[name] = {beaconLocX: x, beaconLocY: y, distance: 9999};

            addNameList(name);
        }

        //加入config nameList內容
        function addNameList(name){
            //var add = 0;
            //檢查是名稱表內是否有一樣的名字
            if(beaconData[name] === undefined){
                beaconData["config"].nameList.push(name);
                beaconData["config"].number++;
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
        if(beaconData["config"] === undefined){
            $.ajax({
                url: "http://140.130.35.62/csie40343142/Tour_System_server/php/TourGetBeaconData.php",
                type: "POST",
                dataType: "json",
                success: function(result){
                    //將目前展區beacon 位置資訊讀入
                    //將beaconData陣列的config初始化(給定beacon數量)
                    calcLocation.addBeaconData("config", 0, 0);
                    for(var i=0; i<result['beaconName'].length; i++){
                        console.log("outside:"+result['location_x'][i]+" "+ result['location_y'][i]);
                        var x = result['location_x'][i]; var y = result['location_y'][i];
                        calcLocation.addBeaconData(result['beaconName'][i], x, y);
                    }
                },
                error: function(){
                    console.log("get beacon data error!!");
                }
            });
        }
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
                    calcLocation.addBeaconData("config", 0, 0);
                }
                else if(result.status === "scanResult"){
                  //掃描beacon
                  //var name1 = result.name.replace(/(\W+)/g, "");
                  var name = result.address.replace(/(\W+)/g, "");
                  //alert(name);
                  calcLocation.addScanedBeacon(name, result.rssi);
                  calcLocation.addBeaconData(name, 0, 0);
                }
            },
            function(error){console.log("scan error! "+error); return;},{sercvices:[]});
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
            calcLocation.addBeaconData(beaconName, 0, 0);
            beaconData[beaconName].distance = temp2;
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
        GaussianElimination.main();
        /*if($("#userLocation").length > 0){
          $("#userLocation").html("X:"+ gaussianProcessData["config"].s[0] + "  Y:" + gaussianProcessData["config"].s[1]);
>>>>>>> release/debugSearch
        }
        else{
            $("#dsa").append("<a>calced!</a>");
            $("#dsa").append("<a id='userLocation'>X:" + gaussianProcessData["config"].s[0] + "  Y:"+ gaussianProcessData["config"].s[1]);
        }*/
        //gaussianProcessData = undefined;
    }
    return x;
  },
  arrayFill: function(i, n, v){
    var a = [];
    for (; i < n; i++) {
        a.push(v);
    }
    return a;
  }
};
//-------------------------------------------------
//Code: C.H Chiang 蔣政樺
//function: 藍牙室內定位 方法 RSS whit 高斯消去法
//-------------------------------------------------
//-------------------------------------------------
//Code: C.H Chiang 蔣政樺
//function: 繪製使用者地圖標示其目前位置
//-vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv-
var userLocationMap; //存放使用者目前地圖顯示資訊
/*
  code by C.H Chiang
  function: 初始化地圖，擷取使用者畫面大小，初始化畫布
  use: initializeMap
*/
function initializeMap(){
  console.log("draw map initialize!!");
  var deviceWidth = screen.width/window.devicePixelRatio;
  var deviceHeight = screen.height/window.devicePixelRatio;
  console.log(deviceWidth+" "+deviceHeight)
  ;
  var canvas = document.getElementById("mapCanvas");
  var ctx = canvas.getContext("2d");
  //var img = new Image();
  //img.src = "image/6.jpg";
  //ctx.drawImage(img, 0, 0);
  userLocationMap = new userSourceComponent(0, 0, deviceWidth, deviceHeight);
  //map.test();
  map.start(deviceWidth, deviceHeight);
}
<<<<<<< HEAD
/*
code by C.H Chiang
class: 使用者所在的地圖，初始化地圖以及更新畫面上地圖顯示
*/
var map = {
  canvas: document.getElementById("mapCanvas"),
  test: function(){
    var ctx = this.canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = "5";
    ctx.strokeStyle = "green";
    ctx.moveTo(0,75);
    ctx.lineTo(80,75);
    ctx.stroke();
  },
  start: function(w, h){
  console.log("draw map start!!");
    this.canvas.width = w;
    this.canvas.height = h;
    this.context = this.canvas.getContext("2d");
    //document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    //userLocationMap.img.onload = function(){
      //console.log("start interval!");
      //this.interval = setInterval(updateMap);
    //}
  },
  clear: function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
/*
  code by C.H Chiang
  function: 使用者所看到的地圖
  use: new userSourceComponent(x,y,w,h)
*/
function userSourceComponent(x,y,w,h){
  this.w = w;
  this.h = h;
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.speedY = 0;
  //this.img = new Image();
  // this.img.onload = function(){
  //   //window.onresize = update;
  //   update();
  // }
  //this.img.src = "/image/6.jpg";
  // function fitToContainer(){
  //   ctx = map.context;
  //   ctx.drawImage(this.img, this.x, this.y, this.w, this.h, 0, 0, this.w, this.h);
  // }
  this.update = function(){
    ctx = map.context;
    //背景地圖待修復
    //ctx.drawImage(this.img, this.x, this.y, this.w, this.h, 0, 0, this.w, this.h);
    // ctx.fillStyle = "red";
    // ctx.fillRect(this.x, this.y, this.w-10, this.h-10);
    for(var i=0; i<beaconData["config"].number; i++){
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.arc((this.w/2)+(beaconData[beaconData["config"].nameList[i]].beaconLocX*(this.w/10)), (this.h/2)+(beaconData[beaconData["config"].nameList[i]].beaconLocY*(this.h/10)),10, 0, 2*Math.PI)
      ctx.fill();
    }
    ctx.beginPath();
    ctx.fillStyle = "red";
    console.log("gaussian X: "+ ((this.w/2)+(parseFloat(gaussianProcessData["config"].s[0])*(this.w/10)))+"    Y: "+((this.h/2)+(parseFloat(gaussianProcessData["config"].s[1])*(this.h/10))));
    ctx.arc((this.w/2)+Math.round(parseFloat(gaussianProcessData["config"].s[0])*(this.w/10)), (this.h/2)+Math.round(parseFloat(gaussianProcessData["config"].s[1])*(this.h/10)), 10, 0, 2*Math.PI);
    ctx.fill();
  }
  this.newPos = function(){
    this.x += this.speedX;
    this.y += this.speedY;
  }
}

function updateMap(){
  map.clear();
  userLocationMap.update();
  userLocationMap.newPos();
}
//-------------------------------------------------
//Code: C.H Chiang 蔣政樺
//function: 繪製使用者地圖標示其目前位置
//-------------------------------------------------



/*app 初始化及事件處理*/
var app = {
  initialize: function(){
    this.bindEvents();
  },
  bindEvents: function(){
    document.addEventListener('deviceready', this.onDeviceReady, false);
    document.addEventListener("resume", this.onResume, false);
    document.addEventListener("pause", this.onPause, false);
    document.addEventListener("pageshow", this.pageShow, false);
    document.addEventListener("pagebeforehide", this.pagebeforehide, false);
  },
  onDeviceReady: function() {
    window.ga.startTrackerWithId('UA-102252553-1',function(){
      console.log("Started analytics OK!");
      window.ga.trackView('Get in Home');
    });
    app.receivedEvent('deviceready');
  },
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
        //app.addUser(data);
    }
    initializeMap();
    /*紀錄app登入次數  上線將下方註解拿掉即可使用*/
    $.ajax({
        url: "http://140.115.197.16/",
        type: "GET",
        data: "school=nfu&app=客家協會導覽系統",
        dataType: "jsonp",
        jsonp: "callback",
        success: function(json,textStatus){    
            console.log("jsonp.success:"+json.name);    
        },    
        error: function(XMLHttpRequest,textStatus,errorThrown){    
            console.log("jsonp.error:"+textStatus);    
        }
    });
    app.gocalc();
    console.log("Bluetooth initialize");
  },
  onPause: function(){
    clearInterval(myVar);
    bluetoothle.stopScan(function(result){
      console.log("stop scan and put app to background!!");
    },function(result){
      console.log("stop scan and put app to background error!!");
    })
  },
  onResume: function(){
    bluetoothle.initialize(function(result){
      console.log("bluetooth adapter status: "+result.status);
      if(result.status === "enabled")
        myVar = setInterval(calcLocation.deviceScan, 400); 
    }, { request: true, statusReceiver: false });
  },
  gocalc: function(){
    bluetoothle.initialize(function(result){
      console.log("bluetooth adapter status: "+result.status);
      if(result.status === "enabled")
        calcLocation.main(); 
    }, { request: true, statusReceiver: false });
  },
  pageShow: function(){
    console.log("pageshow event trigger!");
    initializeMap();
    app.gocalc();
  },
  pagebeforehide: function(){
    alert("pagebeforehide trigger!");
  }
};
app.initialize();

// $(document).on("pagebeforehide", function(){
//   alert("pagebeforehide trigger!");
//   //console.log("pagebeforehide event trigger!");
//   clearInterval(myVar);
// });
=======

/*
code by C.H Chiang
class: 使用高斯消去法將beacon的RSS誤差值給消去 計算最小誤差值
aj=xj-x1, bj=yj-y1, cj=aj+bj-(dj^2-d1^2)
variables: gaussianProcessData用於高斯演算法
                s 為最終計算使用者位置結果x,y
                a = |a1  b1 c1|
                    |.   .  . |
                    |an  bn cn|
*/
var x1 = 0, y1 = 0;
var gaussianProcessData = [];
var GaussianElimination={
  /*
  code by C.H Chiang
  function: main> 高斯消去法 進入點
  input: null
  output: null
  use: GaussianElimination.main()
  */
  main: function(){
      console.log("start calc!!!!!!!!!!!!!!!!!!!!!!!!!!!  " + beaconData["config"].nameList[0] +
       " X:"+beaconData[beaconData["config"].nameList[0]].beaconLocX +
        " Y:"+beaconData[beaconData["config"].nameList[0]].beaconLocY);
        console.log("start calc!!!!!!!!!!!!!!!!!!!!!!!!!!!  " + beaconData["config"].nameList[1] +
         " X:"+beaconData[beaconData["config"].nameList[1]].beaconLocX +
          " Y:"+beaconData[beaconData["config"].nameList[1]].beaconLocY);
          console.log("start calc!!!!!!!!!!!!!!!!!!!!!!!!!!!  " + beaconData["config"].nameList[2] +
           " X:"+beaconData[beaconData["config"].nameList[2]].beaconLocX +
            " Y:"+beaconData[beaconData["config"].nameList[2]].beaconLocY);
      GaussianElimination.getData();
  },
  /*
  code by C.H Chiang
  function: addData> 將高斯消去法之s,h,q矩陣加入資料
  input: beaconName
  output: null
  use: GaussianElimination.addData(beaconName)
  */
  addData: function(name){
    if(name === "config"){
      if(gaussianProcessData["config"] == undefined){
        gaussianProcessData["config"] = {number: 0, s: [], a: []};
        gaussianProcessData["config"].a[0] = [];
        gaussianProcessData["config"].a[1] = [];
        gaussianProcessData["config"].a[2] = [];
        /*
        網頁伺服器讚實無法改動
        因此先給定值
        */
        /*if(beaconData[beaconData["config"].nameList[0]] != undefined){
          beaconData[beaconData["config"].nameList[0]].beaconLocX = 1.0;
          beaconData[beaconData["config"].nameList[0]].beaconLocY = 2.0;
        }
        if(beaconData[beaconData["config"].nameList[1]] != undefined){
          beaconData[beaconData["config"].nameList[1]].beaconLocX = 1.0;
          beaconData[beaconData["config"].nameList[1]].beaconLocY = 2.0;
        }
        if(beaconData[beaconData["config"].nameList[2]] != undefined){
          beaconData[beaconData["config"].nameList[2]].beaconLocX = 1.0;
          beaconData[beaconData["config"].nameList[2]].beaconLocY = 2.0;
        }*/
        ////////////////////////////////////////////////////////
      }
    }
    else{
      //由aj bj cj 組合為一個a陣列 給高斯演算法做計算
      var aj = beaconData[name].beaconLocX - beaconData[beaconData["config"].nameList[0]].beaconLocX;
      var bj = beaconData[name].beaconLocY - beaconData[beaconData["config"].nameList[0]].beaconLocY;
      var cj = (aj + bj - (Math.pow(beaconData[name].distance, 2.0)-Math.pow(beaconData[beaconData["config"].nameList[0]].distance, 2.0)));

      if(gaussianProcessData[name] != undefined){
        gaussianProcessData["config"].number += 1;
      }
      console.log("this is aj = "+aj);
      console.log("this is bj = "+bj);
      console.log("this is cj = "+cj);
      //a[0]為a1~an, a[1]為b1~bn, a[2]為c1~cn
      gaussianProcessData["config"].a[0].push(aj);
      gaussianProcessData["config"].a[1].push(bj);
      gaussianProcessData["config"].a[2].push(cj);
      //console.log("asdawdqaefwefawrgawgwrg     " + gaussianProcessData["config"].a[0]);
    }
  },
  /*
  code by C.H Chiang
  function: getData> 以beaconName依序 將資料加入高斯演算法資料陣列
  input: null
  output: null
  use: GaussianElimination.getData()
  */
  getData: function(){
    GaussianElimination.addData("config");
    for(var i=1; i<beaconData["config"].nameList.length; i++){
      GaussianElimination.addData(beaconData["config"].nameList[i]);
    }
    if(beaconData["config"].nameList.length >=3){
        console.log("realy calc!!!!!!!!!!!");
        gaussianProcessData["config"].s = GaussianElimination.gaussianCalc();
    }
  },
  gaussianCalc: function(){
        console.log("this is a[0] = "+gaussianProcessData["config"].a[0]);
        console.log("this is a[1] = "+gaussianProcessData["config"].a[1]);
        console.log("this is a[2] = "+gaussianProcessData["config"].a[2]);
        var aa = [];
        //將橫向陣列內容轉為直向
        for(var i=0; i<gaussianProcessData["config"].a[0].length; i++){
            aa[i] = [];
            for(var o=0; o<3; o++){
              aa[i].push(gaussianProcessData["config"].a[o][i]);
            }
        }


        var n = aa.length;
        for(var i=0; i<n; i++){
          var maxEl = Math.abs(aa[i][i]);
          var maxRow = i;
          // Search for maximum in this column
          for(var o=i+1; o<n; o++){
            if(Math.abs(aa[o][i]) > maxEl){
              maxEl = Math.abs(aa[o][i]);
              maxRow = o;
            }
          }
          // Swap maximum row with current row (column by column)
          for (var o=i; o<n+1; o++) {
              var tmp = aa[maxRow][o];
              aa[maxRow][o] = aa[i][o];
              aa[i][o] = tmp;
          }
          // Make all rows below this one 0 in current column
          for (var o=i+1; o<n; o++) {
              var c = -aa[o][i]/aa[i][i];
              for(var j=i; j<n+1; j++) {
                  if (i==j) {
                      aa[o][j] = 0;
                  } else {
                      aa[o][j] += c * aa[i][j];
                  }
              }
          }
        }
        console.log("aa is "+aa);
        // Solve equation Ax=b for an upper triangular matrix A
        var x= new Array(n);
        for (var i=n-1; i>-1; i--) {
            x[i] = aa[i][n]/aa[i][i];
            console.log("x["+i+"] is " + x[i]);
            for (var k=i-1; k>-1; k--) {
                aa[k][n] -= aa[k][i] * x[i];
            }
        }
        //console.log("x is " + x);
        return x;
    }
}
>>>>>>> release/debugSearch
