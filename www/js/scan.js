/***********************
**					  **
**	    Beacon  	  **
**					  **
************************/
// Beacon data storage class
// use for local storage
// call this class to put your data into local storage

var beaconDataStorage = new BeaconDataStorage();

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

$(window).ready(function() {
	getData();
	scanText(0);
	$('#tiger').hide();
});
var pages = ["#pageOne", "#pageTwo"];
var nowPage = 0;

pageTopBKColorInit();
pageRender();
$("#pageOne").show();

function pageTopBKColorInit(){
	$("#pageOne").hide();
	$("#pageTwo").hide();
	$("#goPageOne").css("background", "white");
	$("#goPageTwo").css("background", "white");
}

function pageRender(){ //被點選時呈現藍底
	switch(nowPage){
		case 0:
			$("#goPageOne").css("background", "#38c");
			break;
		case 1:
			$("#goPageTwo").css("background", "#38c");
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
	$('#chart').hide();
	$('#tiger').show();
	scanHtml = '';
	$('#scanData').html('');
});

$("#goPageTwo").click(function() {
	nowPage = 1;
	pageTopBKColorInit();
	pageRender();
	htmlShow();
	scan();
	$('#tiger').show();
	scanHtml = '';
	$('#scanData').html('');
});

$(document).on("swipeleft",function(e){
	if(nowPage == 1){
		var winOpen = window.open('day.html');
		window.close();
		return;
	}
  	nowPage = 1;
	pageTopBKColorInit(); 
	pageRender();
	htmlShow();
	scan();
	$('#tiger').show();
	scanHtml = '';
	$('#scanData').html('');
	$('#goPageOne').removeClass('ui-btn-active');
    $('#goPageOne').removeClass('ui-state-persist');
    $('#goPageTwo').addClass('ui-btn-active');
    $('#goPageTwo').addClass('ui-state-persist');
});

$(document).on("swiperight",function(e){
	if(nowPage == 0){
		var winOpen = window.open('index.html');
		window.close();
		return;
	}
	nowPage = 0;
	pageTopBKColorInit();
	pageRender();
	htmlShow();
	if($('#optionOfList').val() == '圖表'){
		$('#example').hide();
		$('#example_wrapper').hide();
		$('#chart').show();
		searchDataProcess();
	}
	else {
		$('#example').show();
		$('#example_wrapper').show();
		$('#chart').hide();
		contorlAPI.search( $('#optionOfType').val() ).draw();
	}
	$('#chart').show();
	scanHtml = '';
	$('#scanData').html('');
	$('#goPageTwo').removeClass('ui-btn-active');
    $('#goPageTwo').removeClass('ui-state-persist');
    $('#goPageOne').addClass('ui-btn-active');
    $('#goPageOne').addClass('ui-state-persist');
});


// 
// 處理資料區
// 

var allView = [];
var contorlAPI;

function getData() {
	$.when($.getJSON('http://140.130.35.62/hakka/hakkamanager/php/get.php')).done(function(result){
		allView = result;
		imgProcess();
	});
}

function imgProcess() {
	var imgHeadler = '<img src="http://140.130.35.62/hakka/hakkamanager';
	var imgFoodler = '" height="150" width="150">';
	for(var i = 0 ; i < allView.length ; i++)
	{
		allView[i][1] = imgHeadler + allView[i].url+ '.jpg' + imgFoodler;
	}
	show();
	showData();
}

function show() {
	var data = allView;
	table = $('#example').DataTable( {
        "data": data,
        "columns": [
			{ title: "ID" },
			{ title: "圖片" },
			{ title: "分類" },
            { title: "名字" }
		],
		"initComplete": function () {
			contorlAPI = this.api();
		}
	});
	table.column( 2 ).visible( false );
}

//切換分類
$('#optionOfType').change(function() {
	if($('#optionOfList').val() == '列表')
		contorlAPI.search( $(this).val() ).draw();
	else
		searchDataProcess();
});

//切換呈現方式
$('#optionOfList').change(function() {
	if($(this).val() == '圖表'){
		$('#example').hide();
		$('#example_wrapper').hide();
		$('#chart').show();
		searchDataProcess();
	}
	else {
		$('#example').show();
		$('#example_wrapper').show();
		$('#chart').hide();
		contorlAPI.search( $('#optionOfType').val() ).draw();
	}
});

//點選清單時
$('#example').on('click', 'tr', function () {

	var data = table.row( this ).data();

	if(typeof data == 'undefined')
		return;

	var value = allView[data[0] - 1].id;
	
	sendValueForNewPage(value);
});

//前往搜尋子頁面
function sendValueForNewPage(val) {
	var winOpen = window.open('default.html?' + val);
	$('#tiger').show();
	scanHtml = '';
}

//圖表型式
function showData() {
	var html = '';
	for(var i = 0; i < allView.length; i+=3)
	{
		html +=         "<div class='ui-grid-b' style='height:150px;width:100%'>"+
								"<div id='" + allView[i].id + "' class='ui-block-a' style='height:100%;'>" + 
									"<div is='icon' style='width:100%; height:100%; position:relative'>" + 
										"<span class='ui-li-count' style='position:absolute; display:none; z-index:1; right:0; top:6px;'></span>" + 
										"<a href='#' class='ui-btn ui-mini ui-corner-all ui-shadow'" + 
										" style='display:block;margin:5px;height:50%;background-image: url(http://140.130.35.62/hakka/hakkamanager" + allView[i].url + ".jpg); background-size: 95% 80%; background-position: 50% 50%; background-repeat: no-repeat no-repeat;'>" +
										"</a>" +
										"<div style='text-align:center;'>" + allView[i].Name +"</div>" + 
									"</div>" +
								"</div>";
								if(i+1 >= allView.length)
									break;
		html += 		    "<div id='" + allView[i+1].id + "'  class='ui-block-b' style='height:100%;'>" + 
									"<div is='icon' style='width:100%; height:100%; position:relative'>" +
										"<span class='ui-li-count' style='position:absolute; display:none; z-index:1; right:0; top:6px;'></span>" + 
										"<a href='#' class='ui-btn ui-mini ui-corner-all ui-shadow'" + 
										" style='display:block;margin:5px;height:50%;background-image: url(http://140.130.35.62/hakka/hakkamanager" + allView[i+1].url + ".jpg); background-size: 95% 80%; background-position: 50% 50%; background-repeat: no-repeat no-repeat;'>" +
										"</a>" +
										"<div style='text-align:center;'>" + allView[i+1].Name + "</div>" + 
									"</div>" +
								"</div>";
								if(i+2 >= allView.length)
									break;
		html += 			"<div id='" + allView[i+2].id + "' class='ui-block-c' style='height:100%;'>" +
									"<div is='icon' style='width:100%; height:100%; position:relative'>" +
										"<span class='ui-li-count' style='position:absolute; display:none; z-index:1; right:0; top:6px;'></span>" +
										"<a href='#' class='ui-btn ui-mini ui-corner-all ui-shadow'" + 
										" style='display:block;margin:5px;height:50%;background-image: url(http://140.130.35.62/hakka/hakkamanager" + allView[i+2].url + ".jpg); background-size: 95% 80%; background-position: 50% 50%; background-repeat: no-repeat no-repeat;'>" +
										"</a>" +
										"<div style='text-align:center;'>" + allView[i+2].Name + "</div>" +
									"</div>" +
								"</div>" +
							"</div>";
	}
	$('#chart').html(html);
	$('#chart').hide();
}
//點選圖表時
$('#chart').on('click', 'div.ui-grid-b > div', function() {
	var value = $(this).attr('id');
	
	sendValueForNewPage(value);
});

//圖表搜尋
function searchData(data) {
	var html = '';
	for(var i = 0; i < data.length; i+=3)
	{
		    html +=         "<div class='ui-grid-b' style='height:150px;width:100%'>"+
							    "<div id='" + allView[data[i]].id + "' class='ui-block-a' style='height:100%;'>" + 
							    	"<div is='icon' style='width:100%; height:100%; position:relative'>" + 
								    	"<span class='ui-li-count' style='position:absolute; display:none; z-index:1; right:0; top:6px;'></span>" + 
								    	"<a href='#' class='ui-btn ui-mini ui-corner-all ui-shadow'" + 
								    	" style='display:block;margin:5px;height:50%;background-image: url(http://140.130.35.62/hakka/hakkamanager" + allView[data[i]].url + ".jpg); background-size: 95% 80%; background-position: 50% 50%; background-repeat: no-repeat no-repeat;'>" +
								    	"</a>" +
								    	"<div style='text-align:center;'>" + allView[data[i]].Name +"</div>" + 
							    	"</div>" +
								"</div>";
								if(i+1 >= data.length)
									break;
			html +=				"<div id='" + allView[data[i+1]].id + "'  class='ui-block-b' style='height:100%;'>" + 
							    	"<div is='icon' style='width:100%; height:100%; position:relative'>" +
								    	"<span class='ui-li-count' style='position:absolute; display:none; z-index:1; right:0; top:6px;'></span>" + 
								    	"<a href='#' class='ui-btn ui-mini ui-corner-all ui-shadow'" + 
								    	" style='display:block;margin:5px;height:50%;background-image: url(http://140.130.35.62/hakka/hakkamanager" + allView[data[i+1]].url + ".jpg); background-size: 95% 80%; background-position: 50% 50%; background-repeat: no-repeat no-repeat;'>" +
								    	"</a>" +
								    	"<div style='text-align:center;'>" + allView[data[i+1]].Name + "</div>" + 
							    	"</div>" +
								"</div>";
								if(i+2 >= data.length)
									break;
			html +=				"<div id='" + allView[data[i+2]].id + "' class='ui-block-c' style='height:100%;'>" +
							    	"<div is='icon' style='width:100%; height:100%; position:relative'>" +
								    	"<span class='ui-li-count' style='position:absolute; display:none; z-index:1; right:0; top:6px;'></span>" +
								    	"<a href='#' class='ui-btn ui-mini ui-corner-all ui-shadow'" + 
								    	" style='display:block;margin:5px;height:50%;background-image: url(http://140.130.35.62/hakka/hakkamanager" + allView[data[i+2]].url + ".jpg); background-size: 95% 80%; background-position: 50% 50%; background-repeat: no-repeat no-repeat;'>" +
								    	"</a>" +
								    	"<div style='text-align:center;'>" + allView[data[i+2]].Name + "</div>" +
							    	"</div>" +
							    "</div>" +
						   "</div>";
	}
	$('#chart').html(html);
}

function searchDataProcess() {
	$('#chart').html('');
	var temp = [];
	switch($('#optionOfType').val()) {
		case '產業工具':
			temp = search_loop('產業工具');
			searchData(temp);
			break;
		case '日常用品':
			temp = search_loop('日常用品');
			searchData(temp);
			break;
		case '運輸工具':
			temp = search_loop('運輸工具');
			searchData(temp);
			break;
		case '家俱':
			temp = search_loop('家俱');
			searchData(temp);
			break;
		default:
			temp = search_loop('0');
			searchData(temp);
			break;
	}
}

function search_loop(str) {
	temp = [];
	tempAll = [];
	var j = 0;
	for(var i = 0; i < allView.length; i++)
	{
		if(allView[i].Type == str){
			temp[j]=i;
			j++;			
		}
	}
	for(var i = 0 ; i < allView.length ; i++)
		tempAll[i] = allView[i].id - 1;
	if(str == '0')
		return tempAll;
	else
		return temp;
}


/***********************
**					  **
**	  BeaconScan 	  **
**					  **
************************/

var beaconTurn = new Boolean(true);
var beaconDevice = new Array();
var beaconDevice2 = new Array();

function scan() {
	bluetoothle.startScan(
		function(result){
		if (result.status === "scanResult") 
		    {
		    	var name = new Array();
	            name = result.name.toString().split(" ");
	            if(result.rssi*-1.2 < 70)
	            {
	            	if(beaconTurn){
		            	beaconDevice.push(name[0]);
	            	}
		           	else {
		           		beaconDevice2.push(name[0]);
		           	}
	           }
			}
		},
		function(error){},{services: []});
	setTimeout(bluetoothle.stopScan, 5000, function(result){
		if(beaconTurn){
			scanPick();
			beaconTurn = !beaconTurn;
		}
		else {
			scanPick2();
			beaconTurn = !beaconTurn;
		}
	},function(error){});
}

function scanDataClear() {
	var Empty = '';
	$('#scanData').html(Empty);
}

function scanPick() {
	var html = '';
	beaconDevice = beaconDevice.filter(function (el, i, arr) {
		return arr.indexOf(el) === i;
	});
	$('#tiger').hide();
	for(var i = 0; i < beaconDevice.length ; i++)
	{
		switch(beaconDevice[i]){
			case '001AC07B063C':
				html += scanShow(0);
				break;
			case '001AC07B0638':
				html += scanShow(6);
				break;
			case '001AC07B0656':
				html += scanShow(12);
				break;
		}
	}
	$('#scanData').html(html);
	beaconDevice = [];
	scan();
}

function scanPick2() {
	var html = '';
	beaconDevice2 = beaconDevice2.filter(function (el, i, arr) {
		return arr.indexOf(el) === i;
	});
	for(var i = 0; i < beaconDevice2.length ; i++)
	{
		console.log('in loop');
		switch(beaconDevice2[i]){
			case '001AC07B063C':
				html += scanShow(0);
				break;
			case '001AC07B0638':
				html += scanShow(6);
				break;
			case '001AC07B0656':
				html += scanShow(12);
				break;
		}
	}
	$('#scanData').html(html);
	beaconDevice2 = [];
	scan();
}

function scanShow(j) {
	var scanHtml = '';
	for(var i = j; i < j+5; i+=3)
	{
		scanHtml +=         "<div class='ui-grid-b' style='height:150px;width:100%'>"+
								"<div id='" + allView[i].id + "' class='ui-block-a' style='height:100%;'>" + 
									"<div is='icon' style='width:100%; height:100%; position:relative'>" + 
										"<span class='ui-li-count' style='position:absolute; display:none; z-index:1; right:0; top:6px;'></span>" + 
										"<a href='#' class='ui-btn ui-mini ui-corner-all ui-shadow'" + 
										" style='display:block;margin:5px;height:50%;background-image: url(http://140.130.35.62/hakka/hakkamanager" + allView[i].url + ".jpg); background-size: 95% 80%; background-position: 50% 50%; background-repeat: no-repeat no-repeat;'>" +
										"</a>" +
										"<div style='text-align:center;'>" + allView[i].Name +"</div>" + 
									"</div>" +
								"</div>";
								if(i+1 >= allView.length)
									break;
		scanHtml += 		    "<div id='" + allView[i+1].id + "'  class='ui-block-b' style='height:100%;'>" + 
									"<div is='icon' style='width:100%; height:100%; position:relative'>" +
										"<span class='ui-li-count' style='position:absolute; display:none; z-index:1; right:0; top:6px;'></span>" + 
										"<a href='#' class='ui-btn ui-mini ui-corner-all ui-shadow'" + 
										" style='display:block;margin:5px;height:50%;background-image: url(http://140.130.35.62/hakka/hakkamanager" + allView[i+1].url + ".jpg); background-size: 95% 80%; background-position: 50% 50%; background-repeat: no-repeat no-repeat;'>" +
										"</a>" +
										"<div style='text-align:center;'>" + allView[i+1].Name + "</div>" + 
									"</div>" +
								"</div>";
								if(i+2 >= allView.length)
									break;
		scanHtml += 			"<div id='" + allView[i+2].id + "' class='ui-block-c' style='height:100%;'>" +
									"<div is='icon' style='width:100%; height:100%; position:relative'>" +
										"<span class='ui-li-count' style='position:absolute; display:none; z-index:1; right:0; top:6px;'></span>" +
										"<a href='#' class='ui-btn ui-mini ui-corner-all ui-shadow'" + 
										" style='display:block;margin:5px;height:50%;background-image: url(http://140.130.35.62/hakka/hakkamanager" + allView[i+2].url + ".jpg); background-size: 95% 80%; background-position: 50% 50%; background-repeat: no-repeat no-repeat;'>" +
										"</a>" +
										"<div style='text-align:center;'>" + allView[i+2].Name + "</div>" +
									"</div>" +
								"</div>" +
							"</div>";
	}
	return scanHtml;
}

function scanText(i) {
	var text = ['搜尋中','搜尋中.','搜尋中..','搜尋中...'];
	i = ( i % 4 ) + 1;
	$('#scanText').html(text[i]);
	setTimeout(function() {
		scanText(i);
	},1000);
}

$('#scanData').on('click', 'div.ui-grid-b > div', function() {
	var value = $(this).attr('id');
	
	sendValueForNewPage(value);
});
