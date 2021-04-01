const fs = require("fs");

const randomstring = require("randomstring");

const DATABASE = "./databases/data.json";

if (!fs.existsSync("./databases"))
	fs.mkdir("./databases", err => {});

function addDatabase(name) {
	const databases = readDatabases();
	if (name in databases)
		return false;
	databases[name] = [];
	fs.writeFileSync(DATABASE, JSON.stringify(databases));
	return true;
}

function readDatabases() {
	try {
		const result = JSON.parse(fs.readFileSync(DATABASE, "utf8"));
		return result == undefined ? {} : result;
	} catch (e) {
		return {};
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
		return {};
	return databases[database] == undefined ? {} : databases[database];
}

function deleteData(database, id) {
	const tabel = getTabel(database);
	console.log(tabel)
	if (tabel.isEmpty())
		return false;
	for (let i = 0; i< tabel.length; i++)
		if (tabel[i].id == id)
			delete tabel[i];
	console.log(tabel)
	return true;
}

function addData(database, req) {
	const tabel = getTabel(database);
	const databases = readDatabases();
	if (!database in databases)
		return false;

	const file = req.files.img;
	const fileName = new Date().getTime() + "_" + randomstring.generate({
	  length: 20,
	  charset: 'alphabetic'
	});

	fs.mkdir(`./databases/img/${req.params.databse}/`, {recursive: true}, err => {});

	file.mv(`./databases/img/${req.params.databse}/${fileName}`, err => console.log(err));
	const newData = req.body;
	newData.img = fileName;
	newData.id = new Date().getTime();

	databases[database].push(newData);
	fs.writeFileSync(DATABASE, JSON.stringify(databases));
	return newData;
}

function updateData(database, index, obj) {
	const databases = readDatabases();
	if (databases == null ||  !database in databases || index < 0 || index >= databases[database].length)
		return null;
	databases[database][index] = obj;
	fs.writeFileSync(DATABASE, JSON.stringify(databases));
	return obj;
}

module.exports = {addDatabase, readDatabases, deleteData, getDatabasesName, getTabel, addData, updateData};