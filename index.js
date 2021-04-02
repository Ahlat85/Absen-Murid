// (async () => {
// 	const randomstring = require("randomstring");

// 	const DATABASES = "./databases";
// 	const DATABASES_JSON =  DATABASES + "/data.json";
// 	const OUTPUT = "./output";

// 	// const output = `${OUTPUT}/${randomstring.generate({length: 20, charset: 'alphabetic'})}/archive.zip`;
// 	const output = `${OUTPUT}/archive.zip`;
// 	console.log(output);
// 	// const zipdir = require("zip-dir");
// 	// zipdir("./databases/", {saveTo: "./output/archive.zip"}, (err, buffer) => {
// 	// 	console.log(err)
// 	// 	console.log(buffer)
// 	// })
// })()


const express = require("express");
const upload = require("express-fileupload");
const app = express();
const PORT = process.env.PORT || 8512;

app.set("view engine", "ejs");

app.use(upload());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use("/db/img", express.static("databases/img"));
app.use("/assets/css", express.static("public/css"));
app.use("/assets/img", express.static("public/img"));
app.use("/assets/js", express.static("public/js"));
app.use("/output", express.static("output"));

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

// app.get("/test", (req, res) => {
// 	const DATABASES = "./databases";
// 	const DATABASES_JSON =  DATABASES + "/data.json";
// 	const OUTPUT = "./output";

// 	// const output = `${OUTPUT}/${randomstring.generate({length: 20, charset: 'alphabetic'})}/archive.zip`;
// 	const output = `${OUTPUT}/archive.zip`;
// 	console.log("GET FILE")
// 	console.log(__dirname)
// 	// res.sendFile(output);
// 	res.sendFile(__dirname + "/output/archive.zip");
// })

app.listen(PORT, () => {
    console.log(`Aplikasi Berjalan Port: ${PORT}`);
});