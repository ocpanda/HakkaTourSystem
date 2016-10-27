/**
 * 彈出說明視窗功能
 *
 * reference: https://demos.jquerymobile.com/1.2.0/docs/pages/popup/methods.html
 */

/**
 * 首頁彈跳窗(長按)                          
 */
$("#homeImg").on("taphold", function(){
	$("#homePopup").popup("open", {positionTo: "#homeImg", transition: "slideup"});
});
/**
 * 首頁彈跳窗(放開)     
 */
$("#homeImg").on("vmouseup", function(){
	$("#homePopup").popup("close");
});

/**
 * 搜尋彈跳窗(長按)
 * @param  {"taphold",function} ){	$("#searchPopup").popup("open", {positionTo: "#searchImg", transition: "pop"});} 
 * @return {null}
 */
$("#searchImg").on("taphold", function(){
	$("#searchPopup").popup("open", {positionTo: "#searchImg", transition: "slideup"});
});
/**
 * 搜尋彈跳窗(放開)
 * @param  {"vmouseup",function} ){	$("#searchPopup").popup("open", {positionTo: "#searchImg", transition: "pop"});}
 * @return {null}  
 */
$("#searchImg").on("vmouseup", function(){
	$("#searchPopup").popup("close");
});

/**
 * 群組彈跳窗(長按)                          
 */
$("#groupImg").on("taphold", function(){
	$("#groupPopup").popup("open", {positionTo: "#groupImg", transition: "slideup"});
});
/**
 * 群組彈跳窗(放開)     
 */
$("#groupImg").on("vmouseup", function(){
	$("#groupPopup").popup("close");
});

/**
 * 日常彈跳窗(長按)                          
 */
$("#dayImg").on("taphold", function(){
	$("#dayPopup").popup("open", {positionTo: "#dayImg", transition: "slideup"});
});
/**
 * 日常彈跳窗(放開)     
 */
$("#dayImg").on("vmouseup", function(){
	$("#dayPopup").popup("close");
});

/**
 * 訊息彈跳窗(長按)                          
 */
$("#messageImg").on("taphold", function(){
	$("#messagePopup").popup("open", {positionTo: "#messageImg", transition: "slideup"});
});
/**
 * 訊息彈跳窗(放開)     
 */
$("#messageImg").on("vmouseup", function(){
	$("#messagePopup").popup("close");
});

/**
 * 設定彈跳窗(長按)                          
 */
$("#settingImg").on("taphold", function(){
	$("#settingPopup").popup("open", {positionTo: "#settingImg", transition: "slideup"});
});
/**
 * 設定彈跳窗(放開)     
 */
$("#settingImg").on("vmouseup", function(){
	$("#settingPopup").popup("close");
});