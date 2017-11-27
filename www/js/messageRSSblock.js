/**
 * Created by GuanTyng on 2017/11/27.
 */
$(document).on("gkComponentsReady", function () {
    var $ele = $("#gk-11279qZ9"),
        FEED_URL = $ele.attr("service"),
        $listview = $("#gk-11279qZ9").find('[data-role="listview"]');
    rowNum = $ele.attr('rowNum');

    if (FEED_URL) {
        $.ajax({
            beforeSend: function () {
                $listview.css('visibility', 'hidden');
            },
            url: 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=' + rowNum + '&callback=?&q=' + encodeURIComponent(FEED_URL),
            dataType: 'json',
            success: function (data) {
                if (data.responseData.feed && data.responseData.feed.entries) {
                    var models = data.responseData.feed.entries;
                    $listview.gk('model', models);
                    $listview.css('visibility', 'visible');
                }
            }
        });
    }

    $listview.gk('onRow', function (vo) {
        alert(JSON.stringify(vo));
    });

});
var pages = ["#Hall", "#Doc"];
var nowPage = 0;

$(document).on("pageshow", "#message",function(){
    $("#Hall").show();
    $("#Doc").hide();
});
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
});*/

function HallClick(){
    $("#Hall").show();
    $("#Doc").hide();
}
function DocClick(){
    $("#Hall").hide();
    $("#Doc").show();
}
function pageRest(){
    $("#Hall").hide();
    $("#Doc").hide();
}
function htmlShow(){
    $(pages[nowPage]).show();
}

$(document).ready(function () {
    $('#divRssHall').FeedEk({
        FeedUrl: 'http://140.130.35.62/hakka/index.php/component/k2/itemlist?format=feed&moduleID=118',
        MaxCount: 5,
        ShowDesc: true,
        ShowPubDate: true,
        DescCharacterLimit: 50
    });
});
$(document).ready(function () {
    $('#divRssDoc').FeedEk({
        FeedUrl: 'http://140.130.35.62/hakka/index.php/component/k2/itemlist?format=feed&moduleID=124',
        MaxCount: 5,
        ShowDesc: true,
        ShowPubDate: true,
        DescCharacterLimit: 50
    });
});