const express = require("express");
const app = express();
const PORT = process.env.PORT || 8512;

app.set("view engine", "ejs");
app.use("/assets/css", express.static("public/css"));
app.use("/assets/img", express.static("public/img"));
app.use("/assets/js", express.static("public/js"));

// app.all("*", (req, res) => res.redirect("/home"));

app.get("/home", (req, res) => {
	const data = {
		head: {
			title: "Home"
		}
	};
	res.render("home/index", data);
});

app.listen(PORT, () => {
	console.log(`Aplikasi Berjalan Port: ${PORT}`);
});