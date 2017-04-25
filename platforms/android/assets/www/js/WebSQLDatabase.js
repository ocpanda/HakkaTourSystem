/**
 * WebSQL 網頁資料庫
 */

var db;

var databaseINFO = {
	dbName:"HakkaTourSystemLocal",
	dbVersion: "1.0",
	dbDisplayName: "Hakka Tour System DataBase",
	dbEstimatedSize: 2*1024*1024
};

function createDB(){
	db = window.openDatabase(databaseINFO.dbName, databaseINFO.dbVersion, databaseINFO.dbDisplayName, databaseINFO.dbEstimatedSize);
}

function dbError(tx, error){
	console.log(error);
}

function createHakkaLoginTable(){
	db.transaction(function(tx){
		tx.executeSql("CREATE TABLE IF NOT EXISTS HakkaLocalUser (UUID varchar(64), 使用者名稱 varchar(5),User_LocationX double, User_LocationY double);"),[],
		function (){console.log("HakkaLocalUser create successfully!");},
		dbError;
	});
}