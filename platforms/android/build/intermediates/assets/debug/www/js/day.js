/**
 * Created by xiang on 2017/4/25.
 */


var obj;
var record=0;
var i=0;
function Vocabulary (){
    for(var i=0; i<100; i++)
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    var accent = ["種類","客語","客語發音","中文翻譯",
        "英文翻譯","客語例句","中文例句","腔調"];
    $.ajax({
        url: 'http://140.130.35.62/csie40343142/hakka/vocabularyPrint/Vocabulary.php',
        type: 'POST',
        dataType:'json',

        success: function(data){
            obj=data;
            // console.log(data);
            $("#colum1").html(accent[0]);
            $("#colum2").html(data[0]['kind']);
            $("#vol").append("<tr><th class='a'>"+accent[0]+"</th><td id='kind' fontsize=15 >"+data[i]['kind']+"</td></tr>");
            $("#vol").append("<tr><th class='a'>"+accent[1]+"</th><td id='hakka_risigned'>"+data[i]["hakka_risigned"]+"</td></tr>");
            $("#vol").append("<tr><th class='a'>"+accent[2]+"</th><td id='hakka_phoneticon'>"+data[i]["hakka_phoneticon"]+"</td></tr>");
            $("#vol").append("<tr><th class='a'>"+accent[3]+"</th><td id='chinese_risigned'>"+data[i]["chinese_risigned"]+"</td></tr>");
            $("#vol").append("<tr><th class='a'>"+accent[4]+"</th><td id='english_ridigned'>"+data[i]["english_ridigned"]+"</td></tr>");
            $("#vol").append("<tr><th class='a'>"+accent[5]+"</th><td id='hakka_sentence'>"+data[i]["hakka_sentence"]+"</td></tr>");
            $("#vol").append("<tr><th class='a'>"+accent[6]+"</th><td id='chinese_translation'>"+data[i]["chinese_translation"]+"</td></tr>");
            $("#vol").append("<tr><th class='a'>"+accent[7]+"</th><td id='accent'>"+data[i]["accent"]+"</td></tr>");
            $("#vol").before($('<input id="fav" type="image" src="img/btn.png" onclick="fav();" />'));
            $("#vol").trigger('create');
        },
        error: function(xhr, ajaxOptions, thrownError){
            alert("無法連線");
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
}

function btn(value){
    //console.log(obj[value]);
    //console.log(value);
    // $('#kind').html(obj[value]['kind']);
    // $('#hakka_risigned').html(obj[value]['hakka_risigned']);
    // $('#hakka_phoneticon').html(obj[value]['hakka_phoneticon']);
    // $('#chinese_risigned').html(obj[value]['chinese_risigned']);
    // $('#english_ridigned').html(obj[value]['english_ridigned']);
    // $('#hakka_sentence').html(obj[value]['hakka_sentence']);
    // $('#chinese_translation').html(obj[value]['chinese_translation']);
    // $('#accent').html(obj[value]['accent']);
    // record=value;
    alert("按鈕 : "+value);
}

function fav(){
    alert("客語 : "+obj[record]['hakka_risigned']+"  已加入最愛");
}

Vocabulary();