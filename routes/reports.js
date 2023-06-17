const router = require("express").Router();
const reportsController = require("../controllers/reportsController");

router.get("/", reportsController.viewReports);
router.get("/general", reportsController.viewGeneral);
router.get("/specific", reportsController.viewSpecific);

module.exports = router;