const router = require("express").Router();
const { check } = require("express-validator");

const urlControllers = require("../controllers/urls.controllers");

const shrinkValidators = [
  check("originalURL").isURL(),
  check("userId").isMongoId()
];

const publicShrinkValidators = [check("originalURL").isURL()];

router.post("/", shrinkValidators, urlControllers.shrink);
router.post("/public", publicShrinkValidators, urlControllers.publicShrink);
router.delete("/:urlId", urlControllers.delete);

module.exports = router;
