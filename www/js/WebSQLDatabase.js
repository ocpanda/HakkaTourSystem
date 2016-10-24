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
		tx.ececuteSQL();
	});
}