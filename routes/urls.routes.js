const router = require("express").Router();
const { check } = require("express-validator");

const urlControllers = require("../controllers/urls.controllers");
const checkAuth = require("../utils/checkAuth.middleware");

const shrinkValidators = [check("originalURL").isURL()];

const publicShrinkValidators = [check("originalURL").isURL()];

router.post("/public", publicShrinkValidators, urlControllers.publicShrink);

router.use(checkAuth);

router.post("/", shrinkValidators, urlControllers.shrink);
router.post("/batch", urlControllers.batchShrink);
router.patch("/:urlId", urlControllers.updateName);
router.delete("/:urlId", urlControllers.delete);

module.exports = router;
