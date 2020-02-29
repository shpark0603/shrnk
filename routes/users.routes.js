const router = require("express").Router();
const { check } = require("express-validator");

const usersController = require("../controllers/users.controllers");

const signupValidators = [
  check("email").isEmail(),
  check("password").isLength({ min: 6 }),
  check("name")
    .not()
    .isEmpty()
];

router.post("/signup", signupValidators, usersController.signup);
router.post("/login", usersController.login);
router.get("/:userId/urls", usersController.getUrlsByUserId);

module.exports = router;
