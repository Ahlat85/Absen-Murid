const fs = require("fs");

const randomstring = require("randomstring");

const DATABASES = "./databases";
const DATABASES_JSON =  DATABASES + "/data.json";
const OUTPUT = "./output";

if (!fs.existsSync("./databases"))
    fs.mkdir("./databases", err => {});

function addDatabase(name) {
    const databases = readDatabases();
    if (name in databases)
        return false;
    databases[name] = [];
    fs.writeFileSync(DATABASES_JSON, JSON.stringify(databases));
    return true;
}

function deleteDatabase(name) {
    const databases = readDatabases();
    if (!name in databases)
        return false;
    delete databases[name];
    fs.rmdir(`./databases/img/${name}/`, {
        recursive: true
    }, err => {});
    fs.writeFileSync(DATABASES_JSON, JSON.stringify(databases));
    return true;
}

function readDatabases() {
    try {
        const result = JSON.parse(fs.readFileSync(DATABASES_JSON, "utf8"));
        return result == undefined ? {} : result;
    } catch (e) {
        return {};
    }
}

function getDatabasesName() {
    try {
        const result = [];
        for (const database in JSON.parse(fs.readFileSync(DATABASES_JSON, "utf8")))
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

function validateTabel(database) {
    const databases = readDatabases();
    if (databases == null || !database in databases)
        return false;
    for (let i = 0; i < databases[database].length; i++) {
        let isValid = false;
        for (const key in databases[database][i])
            if (key == "id")
                isValid = true;
        if (!isValid)
            databases[database].splice(i, 1);
    }
    fs.writeFileSync(DATABASES_JSON, JSON.stringify(databases));
    return true;
}

function deleteData(database, id) {
    const databases = readDatabases();
    if (databases == null || !database in databases)
        return null;
    for (let i = 0; i < databases[database].length; i++)
        if (databases[database][i].id == id) {
            if (databases[database][i].img) {
                try {
                    fs.unlinkSync(`./databases/img/${database}/${databases[database][i].img}`, err => {});
                } catch (e) {}
            }
            delete databases[database][i];
        }
    fs.writeFileSync(DATABASES_JSON, JSON.stringify(databases));

    validateTabel(database);
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

    fs.mkdir(`./databases/img/${req.params.database}/`, {
        recursive: true
    }, err => {});

    file.mv(`./databases/img/${req.params.database}/${fileName}`, err => {});
    const newData = req.body;
    newData.img = fileName;
    newData.id = new Date().getTime();

    databases[database].push(newData);
    fs.writeFileSync(DATABASES_JSON, JSON.stringify(databases));
    return newData;
}

function getById(database, id) {
    const tabel = getTabel(database);
    if (!tabel)
        return {};
    for (let i = 0; i < tabel.length; i++)
        return tabel[i];
    return {};
}

function updateData(database, id, req) {
    const databases = readDatabases();

    if (databases == null || !database in databases)
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
            if (old && old.img) {
                try {
                    fs.unlinkSync(`./databases/img/${database}/${old.img}`, err => {});
                } catch (e) {}
            }
        }

        req.files.img1.mv(`./databases/img/${database}/${fileName}`, err => {});
        newData.img = fileName;
    } else {
        if (id != "") {
            const old = getById(database, id);
            if (old || old.img)
                newData.img = old.img;
        }
    }

    if (id == "") {
        newData.id = new Date().getTime();
        databases[database].push(newData);
    } else {
        for (let i = 0; i < databases[database].length; i++) {
            if (databases[database][i].id == id) {
                databases[database][i] = newData;
            }
        }
    }

    fs.writeFileSync(DATABASES_JSON, JSON.stringify(databases));
    return newData;
}

function exportDatabases(res) {
	const zipdir = require("zip-dir");
	const path = require("path");

	const random = randomstring.generate({length: 20, charset: 'alphabetic'});
	const output = path.join(require.main.path, `${OUTPUT}/${random}`);

	fs.mkdir(output, {recursive: true}, err => {});
	zipdir(DATABASES, {saveTo: output + "/archive.zip"}, (err, buffer) => {
		res.sendFile(output + "/archive.zip");
		fs.rmdir(`${OUTPUT}/${random}`, {
	        recursive: true
	    }, err => {});
	});
}

function importDatabases(req) {
    console.log(req.files)
}

module.exports = {
    validateTabel,
    deleteDatabase,
    addDatabase,
    getById,
    readDatabases,
    deleteData,
    getDatabasesName,
    getTabel,
    addData,
    updateData,
    exportDatabases,
    importDatabases
};