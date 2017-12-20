/**
 * Created by GuanTyng on 2017/11/27.
 */
var pages = ["#Hall", "#Doc"];
var nowPage = 0;

$(document).on("pageshow", "#message",function(){
    $("#Hall").show();
    $("#Doc").hide();
});
function HallClick(){
    $("#Hall").show();
    $("#Doc").hide();
    nowPage = 0;
    pageRender();
}
function DocClick(){
    $("#Hall").hide();
    $("#Doc").show();
    nowPage = 1;
    pageRender();
}

// $("#HallClick").on("ui-btn-active", function(){
//     nowPage = 0;
//     pageRest();
//     htmlShow();
// });
// $("#DocClick").on("ui-btn-active", function(){
//     nowPage = 1;
//     pageRest();
//     htmlShow();
// });
// function pageRest(){
//     $("#Hall").hide();
//     $("#Doc").hide();
// }
// function htmlShow(){
//     $(pages[nowPage]).show();
// }

$(document).ready(function () {
    $('#divRssHall').FeedEk({
        FeedUrl: 'http://140.130.35.62/hakka/index.php/component/k2/itemlist?format=feed&moduleID=118',
        MaxCount: 5,
        ShowDesc: false,
        ShowPubDate: true,
        DescCharacterLimit: 50
    });
});
$(document).ready(function () {
    $('#divRssDoc').FeedEk({
        FeedUrl: 'http://140.130.35.62/hakka/index.php/component/k2/itemlist?format=feed&moduleID=124',
        MaxCount: 5,
        ShowDesc: false,
        ShowPubDate: true,
        DescCharacterLimit: 50
    });
    $("#btnA").css("background", "#38c");
});

function pageRender(){ //被點選時呈現藍底
    switch(nowPage){
        case 0:
            $("#btnA").css("background", "#38c");
            $("#btnB").css("background", "white");
            break;
        case 1:
            $("#btnA").css("background", "white");
            $("#btnB").css("background", "#38c");
            break;
    }
}


$(document).on("swipeleft",function(e){
    if(nowPage == 1) {
        var winOpen = window.open('eread.html');
        window.close();
    }
    else{
        DocClick();
        $('#btnA').removeClass('ui-btn-active');
        $('#btnA').removeClass('ui-state-persist');
        $('#btnB').addClass('ui-btn-active');
        $('#btnB').addClass('ui-state-persist');
    }
  
});

$(document).on("swiperight",function(e){
    if(nowPage == 0) {
        var winOpen = window.open('day.html');
        window.close();
    }
    else {
        HallClick();
        $('#btnB').removeClass('ui-btn-active');
        $('#btnB').removeClass('ui-state-persist');
        $('#btnA').addClass('ui-btn-active');
        $('#btnA').addClass('ui-state-persist');
    }
});