const express = require("express");
const router = express.Router();

const databases_model = require("../../models/api/Databases_model");

router.get("/", (req, res) => {
	const databases = databases_model.getDatabasesName();
	const data = {
		head: {
			title: "Home"
		},
		body: {
			databases: databases
		}
	};
	res.render("home/index", data);
});

router.post("/add-database/", (req, res) => {
	databases_model.addDatabase(req.body.nama);
	res.redirect("/home");
});

router.get("/show/:database", (req, res) => res.redirect(`/home/show/${req.params.database}/1`));

router.post("/show/:database/:start/:end", (req, res) => {
	const tabel = databases_model.getTabel(req.params.database);
	if (tabel == null || req.params.start < 0) {
		res.send([]);
		return;
	}
	req.params.end = req.params.end > tabel.length ? tabel.length : req.params.end;
	let result = [];
	for (let i = req.params.start; i < req.params.end; i++) {
		result.push(tabel[i])
	}
	res.send(result)
})

router.get("/show/:database/:page", (req, res) => {
	let tabel = databases_model.getTabel(req.params.database);

	const page = parseInt(req.params.page) <= 0 ? 1 : parseInt(req.params.page);
	
	let data = {
		head: {
			title: `Show - ${req.params.database}`
		},
		body: {
			page: page,
			database: req.params.database,
			tabel: tabel
		}
	};

	res.render("home/show", data);
});

router.post("/:databse/add", (req, res) => {
	databases_model.addData(req.params.databse, req);
	res.redirect("/home/show" + req.params.databse);
});


router.post("/:databse/edit", (req, res) => {
	databases_model.addData(req.params.databse, req);
	res.redirect("/home/" + req.params.databse);
});

router.get("/index", (req, res) => res.redirect("/home"));

module.exports = router;