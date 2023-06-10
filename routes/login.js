const express = require("express");
const User = require("../models/User");
const bcrypt = require('bcrypt');
const router = express.Router();

router.get("/", async(req, res) => {
    try{
        req.session.loggedIn = false;
        const users = await User.find();
        const alertMessage = req.flash("alertMessage");
        const alertStatus = req.flash("alertStatus");
        const alert = {message: alertMessage, status: alertStatus};
        res.render("login", {users, alert, title: "Login"});
    }catch(error){
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/");
    }
});

router.post("/", async(req,res) => {
    try{
        const { username, password } = req.body;
        const user = await User.findOne({username});
        if(user){
            const validPass = await bcrypt.compare(password, user.password);
            if(validPass){
                req.session.loggedIn = true;
                req.session.tipeUser = user.jenisusr;
                req.session.userName = username;
                res.redirect("/home");
            }else{
                req.flash("alertMessage", "Password yang dimasukkan salah");
                req.flash("alertStatus", "danger");
                res.redirect("/");
            }
        }else{
            req.flash("alertMessage", "User tidak ditemukan");
            req.flash("alertStatus", "danger");
            res.redirect("/");
        }
    }catch(error){
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/");
    }
});

module.exports = router;