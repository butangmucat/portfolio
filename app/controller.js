const express = require("express");
const session = require("express-session");
const multer = require("multer"); // parse multipart form
const uuidv4 = require("uuid/v4"); // generate post and img id
const fileType = require("file-type"); // determine image type
const moment = require("moment"); // get unix timestamp
const hbs = require("hbs");
const validator = require("validator");
const azurestor = require("../data/azurestor"); // azure storage service
const dao = require("../data/mongoose_dao"); // mongodb
const web_logging_setup = require("./web_logging").setupWebLog;

// initialize app
const app = express();
const upload = multer();
web_logging_setup(app);

// session support
app.use(session({
    secret: 'xxxxxxxxxxxxxxxxxxxxxxx',
    resave: false,
    saveUninitialized: false
}));

// static assets and hbs support
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/../views/"));

// access the admin panel
app.get("/adminpanel", (req, res) => {
    if (req.session.user != null) { // authorized
        console.log(`authorized user: ${req.session.user}`);
        res.render("adminpanel");
    } else { // unauthorized
        console.log(`unauthorized`);
        res.redirect("login");
    }
});

// new post page
app.get("/new", (req, res) => {
    if (req.session.user != null) { // authorized
        console.log(`authorized user: ${req.session.user}`);
        id = uuidv4();
        res.render("edit", {
            postid: id,
            author: req.session.user,
            action: "Add",
            dest: "/new"
        });
    } else { // unauthorized
        console.log(`unauthorized`);
        res.redirect("login");
    }
});

// create new post
app.post("/new", upload.single("img"), async (req, res, next) => {
    let postBean = new Object();
    // hard-code for now
    let imgPrefix = process.env.IMG_PREFIX;
    let imgName = uuidv4();
    let imgType = fileType(req.file.buffer)["ext"];
    postBean.postid = validator.escape(req.body.postid);
    postBean.title = validator.escape(req.body.title);
    postBean.author = validator.escape(req.body.author);
    postBean.time = moment().unix();
    postBean.img = imgPrefix + imgName + "." + imgType;
    postBean.desc = validator.escape(req.body.desc);
    azurestor.uploadFile(imgName, imgType, req.file.buffer, (err) => {
        if (err) {
            res.redirect("/adminpanel");
        } else {
            dao.newPost(postBean, (err) => {
                res.redirect("/adminpanel");
            });
        }
    });
});

// logged in users gets redirected to adminpanel
app.get("/login", (req, res) => {
    if (req.session.user != null) { // logged in
        console.log(`authorized user: ${req.session.user}`);
        res.redirect("adminpanel");
    } else { // not logged in
        console.log(`unauthorized`);
        res.render("login");
    }
});

// actual code to process the upload operation

// for now let me borrow the reverse credential trick
app.post("/login", upload.none(), (req, res, next) => {
    let userId = validator.escape(req.body.uname.toString().trim());
    let password = validator.escape(req.body.passwd.toString().trim());
    let errorMessage = [];

    if (!userId || userId.length == 0) {
        errorMessage.push("User Id is required");
    }

    if (!password || password.length == 0) {
        errorMessage.push("Password is required");
    }

    if (errorMessage.length == 0 && userId != password.split("").reverse().join("")) {
        errorMessage.push("Incorrect login credentials");
    }

    if (errorMessage.length > 0) {
        console.log("Error logging in:", errorMessage);
        res.render('login');
    } else {
        req.session.user = userId;
        res.redirect("/adminpanel");
    }
});

// show post
app.get("/post", (req, res, next) => {
    dao.getPost(req.query.postid, (err, doc) => {
        if (!err) {
            console.log("rendering post")
            res.render("post", doc);
        } else {
            console.log(error);
            res.redirect("/");
        }
    });
});

// index page
app.use((req, res, next) => {
    res.render("index");
});

module.exports.app = app;