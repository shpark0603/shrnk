const router = require("express").Router();

const { shrink } = require("../controllers/home.controllers");

router.post("/shrinkit", shrink);

module.exports = router;
