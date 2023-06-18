const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const {v4:uuidv4} = require("uuid");
const logger = require("morgan");
const flash = require("connect-flash");
const session = require("express-session");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

// Tambah Filter Spesifik

mongoose.connect("mongodb://localhost:27017/db_zilong", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

console.log("Database Terhubung");
console.log("Server berjalan pada : http://localhost/");

const loginRouter = require("./routes/login")
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const booksRouter = require("./routes/books");
const transactionsRouter = require("./routes/transactions");
const reportsRouter = require("./routes/reports");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(methodOverride("_method"));

app.use(
    session({
        secret: uuidv4(),
        resave: false,
        saveUninitialized: true,
    })
);

app.use(flash());

const requireLogin = (req, res, next) => {
    if (!req.session.loggedIn) {
      return res.redirect('/');
    }
    next();
};

const requireAdmin = (req, res, next) => {
    if (req.session.tipeUser !== "Admin") {
        return res.redirect('/');
    }
    next();
};

const requireInternal = (req, res, next) => {
    if (req.session.tipeUser !== "Pegawai" && req.session.tipeUser !== "Admin") {
        return res.redirect('/');
    }
    next();
};

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/static',express.static(path.join(__dirname, "public/stylesheets")));
app.use('/assets',express.static(path.join(__dirname, "public/images")));

app.use("/", loginRouter);
app.use("/home",requireLogin, indexRouter);
app.use("/users",requireLogin, requireAdmin, usersRouter);
app.use("/books",requireLogin, booksRouter);
app.use("/transactions", requireLogin, requireInternal, transactionsRouter);
app.use("/reports", requireLogin, requireInternal, reportsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;