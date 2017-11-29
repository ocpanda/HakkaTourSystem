var allView = [];
var needValue = location.href.split('?'); //取得連結並分割

$(window).ready(function() {
    $('#forBk').width(document.documentElement.clientWidth);
    $('#forBk').height(document.documentElement.clientHeight);
    $.when($.post( "http://140.130.35.62/csie40343113/hakkaPHP/get2.php", { id: needValue[1] })).done(function(result){
        allView = JSON.parse(result);
        imgProcess();
        wordProcess();
	});
})

$('#goMap').click(function() {
    var winOpen = window.open('index.html?' + needValue[1]);
    self.close();
})

function imgProcess() {
	var imgHeadler = 'http://140.130.35.62/hakka/hakkamanager';
    var img = imgHeadler + allView[0].url;
    var imgWidth = document.documentElement.clientWidth;
    var imgHeight = document.documentElement.clientHeight/3;
    $('#Eximg').attr('src', img).attr('width', imgWidth).attr('height', imgHeight);
}

function wordProcess() {
    $('#forName').html(allView[0].Name);
    $('#forPY').html(allView[0].PinYin);
    $('#forJY').html(allView[0].Phonetic);
    $('#forUse').html(allView[0].Content);
}