const router = require("express").Router();

const urlControllers = require("../controllers/urls.controllers");

router.post("/", urlControllers.shrink);
router.delete("/:urlId", urlControllers.delete);

module.exports = router;
