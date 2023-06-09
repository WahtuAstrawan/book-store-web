const router = require("express").Router();
const usersController = require("../controllers/usersController");

router.get("/", usersController.viewUsers);
router.post("/", usersController.addUsers);
router.put("/", usersController.editUsers);
router.delete("/:id", usersController.deleteUsers);

module.exports = router;