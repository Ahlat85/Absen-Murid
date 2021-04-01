const express = require("express");
const router = express.Router();

const databses_model = require("../../models/api/Databases_model");

router.get("/", (req, res) => {
	const databases = databses_model.getDatabasesName();
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


router.get("/:databse", (req, res) => {
	const databases = databses_model.getDatabasesName();
	const data = {
		head: {
			title: "Home"
		},
		body: {
			databases: databases
		}
	};
	res.render("home/view", data);
});

router.post("/:databse/:start/:end", (req, res) => {
	const tabel = databses_model.getTabel(req.params.databse);
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

router.get("/:databse/:page", (req, res) => {
	const tabel = databses_model.getTabel(req.params.databse);

	let data = {
			head: {
				title: "View"
			},
			body: {
				page: req.params.page,
				databse: req.params.databse,
				tabel: tabel,
				allPage: Math.ceil(tabel.length / 4)
			}
		};

	if (req.params.page == "all") {
		data.body.start = 0;
		data.body.end = tabel.length;
		res.render("home/view", data);
	} else {
		const start = tabel.length > (4 * req.params.page) - 4 ? (4 * req.params.page) - 4 : tabel.length - 1;
		const end = ((4 * req.params.page) - 4) + 4 <= tabel.length ? ((4 * req.params.page) - 4) + 4 : tabel.length;

		if (req.params.page > Math.ceil(tabel.length / 4))
			res.redirect(`/home/${req.params.databse}/`);

		data.body.start = start;
		data.body.end = end;
		
		res.render("home/view", data);
	}
});

router.post("/:databse/add", (req, res) => {
	databses_model.addData(req.params.databse, req);
});

router.get("/index", (req, res) => res.redirect("/home"));

module.exports = router;