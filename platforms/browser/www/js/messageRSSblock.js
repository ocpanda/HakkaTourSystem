/**
 * Created by GuanTyng on 2017/11/27.
 */
//var pages = ["#Hall", "#Doc"];
//var nowPage = 0;

$(document).on("pageshow", "#message",function(){
    $("#Hall").show();
    $("#Doc").hide();
});
function HallClick(){
    $("#Hall").show();
    $("#Doc").hide();
}
function DocClick(){
    $("#Hall").hide();
    $("#Doc").show();
}
/*
$("#HallClick").on("ui-btn-active", function(){
    nowPage = 0;
    pageRest();
    htmlShow();
});
$("#DocClick").on("ui-btn-active", function(){
    nowPage = 1;
    pageRest();
    htmlShow();
});
function pageRest(){
    $("#Hall").hide();
    $("#Doc").hide();
}
function htmlShow(){
    $(pages[nowPage]).show();
}*/

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
});