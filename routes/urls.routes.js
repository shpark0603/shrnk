const router = require("express").Router();

const { shrink } = require("../controllers/urls.controllers");

router.post("/", shrink);

module.exports = router;
