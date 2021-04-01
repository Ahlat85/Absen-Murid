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
	validateTabel(database);

	const databases = readDatabases();
	if (databases == null || !database in databases)
		return {};
	return databases[database] == undefined ? {} : databases[database];
}

function validateTabel(database) {
	const databases = readDatabases();
	if (!databases || !databases.isEmpty() || !database in databases)
		return false;
	for (let i = 0; i < databases[database].length; i++) {
		let isValid = false;
		for (const key in databases[database][i])
			if (key == "id")
				isValid = true;
		if (!isValid)
			delete databases[database][i];
	}
	fs.writeFileSync(DATABASE, JSON.stringify(databases));
	return true;
}

function deleteData(database, id) {
	validateTabel(database);
	
	const databases = readDatabases();
	if (databases == null ||  !database in databases)
		return null;
	for (let i = 0; i< databases[database].length; i++)
		if (databases[database][i].id == id) {
			if (databases[database][i].img) {
				try {
					fs.unlinkSync(`./databases/img/${database}/${databases[database][i].img}`, err => console.log(err));
				} catch(e) {}
			}
			delete databases[database][i];
		}
	fs.writeFileSync(DATABASE, JSON.stringify(databases));
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

	fs.mkdir(`./databases/img/${req.params.database}/`, {recursive: true}, err => {});

	file.mv(`./databases/img/${req.params.database}/${fileName}`, err => console.log(err));
	const newData = req.body;
	newData.img = fileName;
	newData.id = new Date().getTime();

	databases[database].push(newData);
	fs.writeFileSync(DATABASE, JSON.stringify(databases));
	return newData;
}

function getById(database, id) {
	const tabel = getTabel(database);
	if (tabel.isEmpty())
		return {};
	for (let i = 0; i < tabel.length; i++)
			return tabel[i];
	return {};
}

function updateData(database, id, req) {
	validateTabel(database);

	const databases = readDatabases();
	if (databases == null ||  !database in databases)
		return null;

	const newData = {
		nama: req.body.nama1,
		kelahiran: req.body.kelahiran1,
		alamat: req.body.alamat1,
		ayah: req.body.ayah1,
		ibu: req.body.ibu1,
		id: id,
	};

	if (req.files != null && req.files.img1 != null) {
		const fileName = new Date().getTime() + "_" + randomstring.generate({
		  length: 20,
		  charset: 'alphabetic'
		});

		if (id != "") {
			const old = getById(database, id);
			if (!old.isEmpty() && old.img) {
				try {
					fs.unlinkSync(`./databases/img/${database}/${old.img}`, err => console.log(err));
				} catch(e) {}
			}
		}

		req.files.img1.mv(`./databases/img/${database}/${fileName}`, err => console.log(err));
		newData.img = fileName;
	} else {
		if (id != "") {
			const old = getById(database, id);
			if (!old || !old.img) {
				try {
					fs.unlinkSync(`./databases/img/${database}/${old.img}`, err => console.log(err));
				} catch (e) {}
			}
		}
	}

	if (id == "") {
		newData.id = new Date().getTime();
		databases[database].push(newData);
	} else {
		for (let i = 0; i < databases[database].length; i++)
			if (databases[database][i].id == id)
				databases[database][i] = newData;
	}

	fs.writeFileSync(DATABASE, JSON.stringify(databases));
	return newData;
}

module.exports = {validateTabel, addDatabase, getById, readDatabases, deleteData, getDatabasesName, getTabel, addData, updateData};