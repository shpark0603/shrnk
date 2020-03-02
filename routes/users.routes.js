const router = require("express").Router();
const { check } = require("express-validator");

const checkAuth = require("../utils/checkAuth.middleware");
const usersController = require("../controllers/users.controllers");

const signupValidators = [
  check("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Must be at least 6 characters long")
    .not()
    .matches(/\s/)
    .withMessage("Must not contain white space")
    .escape(),
  check("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Must not be empty")
    .escape()
];

router.post("/signup", signupValidators, usersController.signup);
router.post("/login", usersController.login);

router.use(checkAuth);
router.get("/:userId/urls", usersController.getUrlsByUserId);
router.get("/logout", usersController.logout);

module.exports = router;
