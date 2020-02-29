const router = require("express").Router();
const { check } = require("express-validator");

const urlControllers = require("../controllers/urls.controllers");

const shrinkValidators = [
  check("originalURL").isURL(),
  check("userId").isMongoId()
];

router.post("/", shrinkValidators, urlControllers.shrink);
router.delete("/:urlId", urlControllers.delete);

module.exports = router;
