const { RegisterUser, loginUser, refreshToken, logout } = require("../controllers/auth.controllers");
const router = require("express").Router();

// api/auth/register
router.route("/register").post(RegisterUser);
router.route("/login").post(loginUser);
router.route("/refresh").get(refreshToken);
router.route("/logout").post(logout);


module.exports = router;