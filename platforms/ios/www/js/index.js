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
      var temp = (-58.3 - rss) / (10 * 5);
      var temp2 = Math.pow(10, temp);
      addData.addBeaconData(beaconName, beaconData[beaconName].beaconLocX, beaconData[beaconName].beaconLocY, temp2);
      //測試用功能
      var beaconNum = fundDevices["config"].nameList.indexOf(beaconName);
      if($("#beacon"+beaconNum).length > 0){
        $("#beacon"+beaconNum).html("與"+beaconName+"平均距離"+temp2);
      }
      else{
        $("#dsa").append("<a id='beacon"+beaconNum+"'>"+"與"+beaconName+"平均距離："+temp2+"</a><br>");
      }
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
      if($("#gauss").length > 0){
        $("#gauss").html("X："+gaussianProcessData["config"].s[0]+"  Y："+gaussianProcessData["config"].s[1]);
        
      }
      else{
        $("#dsa").append("<a id='gauss'>X："+gaussianProcessData["config"].s[0]+"  Y："+gaussianProcessData["config"].s[1]+"</a><br>");
        // $("#dsa").append("<a>aaaaaaaa</a>");
      }
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
        }
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


/*app 初始化及事件處理*/
var app = {
  initialize: function(){
    this.bindEvents();
  },
  bindEvents: function(){
    document.addEventListener('deviceready', this.onDeviceReady, false);
    document.addEventListener("resume", this.onResume, false);
    document.addEventListener("pause", this.onPause, false);
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
        app.addUser(data);
    }

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

    console.log("Bluetooth initialize");
    bluetoothle.initialize(function(result){
        console.log("bluetooth adapter status: "+result.status);
    }, { request: true, statusReceiver: false });
    app.gocalc();
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
    myVar = setInterval(calcLocation.deviceScan, 400);
  },
  gocalc: function(){
    calcLocation.main();
  }
};
app.initialize();
