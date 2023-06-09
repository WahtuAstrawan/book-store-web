const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    if (req.session.loggedIn) {
      const userName = req.session.userName;
      const tipeUser = req.session.tipeUser;
      res.render("index", { userName, tipeUser, title: "Home" });
    } else {
      res.redirect("/");
    }
});
  

module.exports = router;