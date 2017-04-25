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
    //當app 進入背景時關閉myVar interval及beacon掃描
    // onPause: function(){
    //   clearInterval(myVar);
    //   bluetoothle.stopScan(function(result){
    //     console.log("success to stop bluetoothle scan!");
    //     console.log("exit");
    //   }, function(error){
    //     console.log("fail to stop bluetoothle scan!");
    //     console.log("exit");
    //   });
    // },
    // //當app從背景重新呼叫至前景開啟myVar interval即開始掃描
    // onResume: function(){
    //   myVar = setInterval(calcLocation.deviceScan, 300);
    // },
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
var recordClacTime = 0; //紀錄目前計算過幾次距離
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
      myVar = setInterval(calcLocation.deviceScan, 200);
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
      text[name].data.push("<a>距離:"+distance.toFixed(4)+" RSS:"+rss+" 取得時間:"+time+"sec</a><br>");
    },
    /*
    code by C.H Chiang
    function: addScanedCalc> 建立紀錄scan後計算的距離以及計算整體平均值
    input: beacon識別碼, 距離, 信號強度
    output: calcRec
    use: calcLocation.addScanedCalc(name, distance, rss)
    */
    addScanedCalc: function(name, distance, rss){
      if(name === "config"){
        if(calcRec["config"] == undefined){
          calcRec["config"] = {number: 0, nameList: []};
        }
      }
      else if(name === "calcAvg"){
        //addScanedCalc calcAvg動作, name為動作 distance為beacon名稱
        return avgDistance(distance);
      }
      else{
        if(calcRec[name] == undefined){
          addNameList(name);
        }
        endTime = new Date().getTime();
        calcLocation.addData(name,distance,rss,((endTime-startTime)/1000)); //  15  將設備名稱 距離 強度 執行時間加進陣列
        
        if(calcRec[name].distance.length >= 5){
          calcRec[name].distance.splice(recordClacTime, 1, distance);
          recordClacTime = 0;
        }
        else
          calcRec[name].distance.push(distance);
        console.log(calcRec[name].distance);
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
         //return calcRec[name].distance[length];
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
                url: "http://140.130.35.62/hakka/hakkamanager/php/TourGetBeaconData.php",
                type: "POST",
                dataType: "json",
                success: function(result){
                    //將目前展區beacon 位置資訊讀入
                    //將beaconData陣列的config初始化(給定beacon數量)
                    calcLocation.addBeaconData("config", 0, 0);
                    for(var i=0; i<result['uuid'].length; i++){
                        console.log("outside:"+result['locationX'][i]+" "+ result['locationY'][i]);
                        var x = result['locationX'][i]; var y = result['locationY'][i];
                        calcLocation.addBeaconData(result['uuid'][i], x, y);
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
    showDataWin: function(name){
      $("#dataMsg").popup("open", {transition: "pop"});
      $("#devicedd").html(name);
      for(var i=0; i<text[name].data.length; i++){
        $("#dataPopupMsg").append(text[name].data[i]); 
      }
    },
    /*
    code by C.H Chiang
    function: deviceScan> 掃描藍芽
    input: null
    output: null
    use: calcLocation.deviceScan()
    */
    deviceScan: function(){ 
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
                var name = result.address.replace(/(\W+)/g, "");
                if(beaconData[name] != undefined){
                  //alert(name);
                  calcLocation.addScanedBeacon(name, result.rssi);
                  calcLocation.addBeaconData(name, 0, 0);
                }
              }
          },
          function(error){console.log("scan error! "+error); return;},{sercvices:[]});
        calcLocation.startCalc();
        // setTimeout(bluetoothle.stopScan, 1500, function(){
        //   //開始計算距離
        //   calcLocation.startCalc();         
        // });
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
            //(一公尺RSS強度 - 目前接收RSS強度) / (10 * 路徑衰減函數)
            var temp = (-58.3 - rss) / (10 * 5);
            var temp2 = Math.pow(10, temp);
            calcLocation.addBeaconData(beaconName, 0, 0);
            //beaconData[beaconName].distance = temp2;
            calcLocation.addScanedCalc(beaconName, temp2, 0);

            //if(calcRec[beaconName].distance.length >= 15){
                //var disavg = calcLocation.addScanedCalc("calcAvg", beaconName, rss).toFixed(4);
                /*
                code by C.H Chiang
                以下為測試用功能
                測試功能起始點 觸發為 calcLocation.addScanedCalc("calcAvg", beaconName, rss);
                影響index.html <div id=dsa>
                */
                var beaconNum = fundDevices["config"].nameList.indexOf(beaconName);
                if($("#beacon"+beaconNum).length > 0){
                  $("#beacon"+beaconNum).html("與"+beaconName+"平均距離："+temp2);
                }
                else{
                  $("#dsa").append("<a id='beacon"+beaconNum+"'>"+"與"+beaconName+"平均距離："+temp2+"</a><br>");
                }
                $("#bdata").listview("refresh");
                //測試功能到此為止
                beaconData[beaconName].distance = temp2;
            //}
        }
        GaussianElimination.main();
        /*if($("#userLocation").length > 0){
          $("#userLocation").html("X:"+ gaussianProcessData["config"].s[0] + "  Y:" + gaussianProcessData["config"].s[1]);
        }
        else{
            $("#dsa").append("<a>calced!</a>");
            $("#dsa").append("<a id='userLocation'>X:" + gaussianProcessData["config"].s[0] + "  Y:"+ gaussianProcessData["config"].s[1]);
        }*/
        //gaussianProcessData = undefined;
    }
}

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
      }
    }
    else{
      //由aj bj cj 組合為一個a陣列 給高斯演算法做計算
      var aj = beaconData[name].beaconLocX - beaconData[beaconData["config"].nameList[0]].beaconLocX;
      var bj = beaconData[name].beaconLocY - beaconData[beaconData["config"].nameList[0]].beaconLocY;
      var cj = (aj + bj - (Math.pow(beaconData[name].distance, 2.0)-Math.pow(beaconData[beaconData["config"].nameList[0]].distance, 2.0)));
      var tmp = [];
      tmp.push(aj);
      tmp.push(bj);

      if(gaussianProcessData[name] != undefined){
        gaussianProcessData["config"].number += 1;
      }
      console.log("this is aj = "+aj);
      console.log("this is bj = "+bj);
      console.log("this is cj = "+cj);
      //a[0]為a1~an, a[1]為b1~bn, a[2]為c1~cn
      gaussianProcessData["config"].a.push(tmp);
      gaussianProcessData["config"].s.push(cj);
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
        gaussianProcessData["config"].s = GaussianElimination.gaussianCalc(gaussianProcessData["config"].a, gaussianProcessData["config"].s);
        // if($("#gauss").length > 0){
        //   $("#gauss").html("X："+gaussianProcessData["config"].s[0]+"  Y："+gaussianProcessData["config"].s[1]);
        // }
        // else{
        //   $("#dsa").append("<a id='gauss'>X："+gaussianProcessData["config"].s[0]+"  Y："+gaussianProcessData["config"].s[1]+"</a><br>");
        // }
        // $("#bdata").listview("refresh");
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
      x = array_fill(0, n, 0);
      for (i=n-1; i > -1; i--) { 
          x[i] = A[i][n]/A[i][i];
          for (k=i-1; k > -1; k--) { 
              A[k][n] -= A[k][i] * x[i];
          }
      }

      return x;
    },
    // console.log("this is a[0] = "+gaussianProcessData["config"].a[0]);
    // console.log("this is a[1] = "+gaussianProcessData["config"].a[1]);
    // console.log("this is a[2] = "+gaussianProcessData["config"].a[2]);
    // var aa = [];
    // //將橫向陣列內容轉為直向
    // for(var i=0; i<gaussianProcessData["config"].a[0].length; i++){
    //     aa[i] = [];
    //     for(var o=0; o<3; o++){
    //       aa[i].push(gaussianProcessData["config"].a[o][i]);
    //     }
    // }


    // var n = aa.length;
    // for(var i=0; i<n; i++){
    //   var maxEl = Math.abs(aa[i][i]);
    //   var maxRow = i;
    //   // Search for maximum in this column
    //   for(var o=i+1; o<n; o++){
    //     if(Math.abs(aa[o][i]) > maxEl){
    //       maxEl = Math.abs(aa[o][i]);
    //       maxRow = o;
    //     }
    //   }
    //   // Swap maximum row with current row (column by column)
    //   for (var o=i; o<n+1; o++) {
    //       var tmp = aa[maxRow][o];
    //       aa[maxRow][o] = aa[i][o];
    //       aa[i][o] = tmp;
    //   }
    //   // Make all rows below this one 0 in current column
    //   for (var o=i+1; o<n; o++) {
    //       var c = -aa[o][i]/aa[i][i];
    //       for(var j=i; j<n+1; j++) {
    //           if (i==j) {
    //               aa[o][j] = 0;
    //           } else {
    //               aa[o][j] += c * aa[i][j];
    //           }
    //       }
    //   }
    // }
    // console.log("aa is "+aa);
    // // Solve equation Ax=b for an upper triangular matrix A
    // var x= new Array(n);
    // for (var i=n-1; i>-1; i--) {
    //     x[i] = aa[i][n]/aa[i][i];
    //     console.log("x["+i+"] is " + x[i]);
    //     for (var k=i-1; k>-1; k--) {
    //         aa[k][n] -= aa[k][i] * x[i];
    //     }
    // }
    // //console.log("x is " + x);
    // return x;
    array_fill: function(i, n, v){
      var a = [];
      for (; i < n; i++) {
          a.push(v);
      }
      return a;
    }

}
