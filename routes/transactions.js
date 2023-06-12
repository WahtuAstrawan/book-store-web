const router = require("express").Router();
const transactionsController = require("../controllers/transactionsController");

router.get("/", transactionsController.viewTransactions);
router.post("/", transactionsController.addTransactions);
router.put("/:id", transactionsController.editTransactions);
router.delete("/:id", transactionsController.deleteTransactions);

module.exports = router;