const fs = require("fs");

const DATABASE = "databases.json";

function readDatabases() {
	try {
		const result = JSON.parse(fs.readFileSync(DATABASE, "utf8"));
		return result == undefined ? null : result;
	} catch (e) {
		return null;
	}
}

function getDatabasesName() {
	try {
		const result = [];
		for (const database in JSON.parse(fs.readFileSync(DATABASE, "utf8")))
			result.push(database);
		return result;
	} catch (e) {
		return null;
	}
}

function getTabel(database) {
	const databases = readDatabases();
	if (databases == null || !database in databases)
		return null;
	return databases[database];
}

function addData(database, req) {
	console.log(req.files)
	const file = req.files.img;
	const fileName = new Date().getTime() + file.name;
	console.log(fileName)

	fs.mkdir(`./img/${req.params.databse}/`, {recursive: true}, err => {});

	file.mv(`./img/${req.params.databse}/${fileName}`, err => {});
	// const databases = readDatabases();
	// if (databases == null || !database in databases)
	// 	return null;
	// databases[database].push(obj);
	// fs.writeFileSync(DATABASE, JSON.stringify(databases));
	// return obj;
}

function updateData(database, index, obj) {
	const databases = readDatabases();
	if (databases == null ||  !database in databases || index < 0 || index >= databases[database].length)
		return null;
	databases[database][index] = obj;
	fs.writeFileSync(DATABASE, JSON.stringify(databases));
	return obj;
}

module.exports = {readDatabases, getDatabasesName, getTabel, addData, updateData};