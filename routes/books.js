const router = require("express").Router();
const booksController = require("../controllers/booksController");

router.get("/", booksController.viewBooks);
router.post("/", booksController.addBooks);
router.put("/", booksController.editBooks);
router.delete("/:id", booksController.deleteBooks);

module.exports = router;