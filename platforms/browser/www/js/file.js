function WriteData(filename, str) {
     /// <summary>
     /// 寫入檔案
     /// </summary>
     /// <param name="filename">檔名</param>
     /// <param name="str">內容</param>
     window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dir) {
         dir.getFile(filename, { create: true }, function (file) {
 
             file.createWriter(function (fileWriter) {
                 fileWriter.write(str);
             }, function (ex) {
                 navigator.notification.alert(ex.target.error.code, null, 'Ｅrror', 'OK');
 
             });
         });
     });
 
 }

 function ReadFileString(filename, succFunc) {
     /// <summary>
     /// 讀取資料
     /// </summary>
     /// <param name="filename">檔名</param>
     /// <param name="succFunc">成功的呼叫事件</param>
     window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dir) {
         dir.getFile(filename, { create: true }, function (fileObject) {
             fileObject.file(function (file) {
                 var reader = new FileReader();
                 reader.onloadend = function (e) {
                     succFunc(this.result);
                 };
                 reader.readAsText(file);
             }, function (ex) {
                 navigator.notification.alert(ex.target.error.code, null, 'Ｅrror', 'OK');
                
             });
         });
     });
 
 }

 function message1(str) {
    navigator.notification.alert(str, null, 'Info', 'OK');
}
 
// $('#btnWrite').attr('onclick', 'btnWrite_click()');
 
// function btnWrite_click() {
//     WriteData("xxx.txt", "許當麻" + new Date());
 
//     ReadFileString("xxx.txt", message1);
 
// };