const { getAllUsers, countUsers } = require('../controllers/users.controllers');
const verifyToken = require('../middlewares/verifyToken');
const router = require('express').Router();

router.route("/").get(verifyToken,getAllUsers);

router.route("/count").get(verifyToken,countUsers);

module.exports = router;