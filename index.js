const express = require("express");
const upload = require("express-fileupload");
const app = express();
const PORT = process.env.PORT || 8512;

app.set("view engine", "ejs");

app.use(upload());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/assets/css", express.static("public/css"));
app.use("/assets/img", express.static("public/img"));
app.use("/assets/js", express.static("public/js"));

app.all("/undefined", (req, res) => res.redirect("/home"));
app.all("/", (req, res) => res.redirect("/home"));

//  ROUTER
const homeRouter = require("./routes/home/home_router");
const apiRouter = require("./routes/api/api_router");

app.use("/home", homeRouter);
app.use("/api", apiRouter);

app.get("*", (req, res) => {
  res.redirect("/home");
});

app.listen(PORT, () => {
	console.log(`Aplikasi Berjalan Port: ${PORT}`);
});