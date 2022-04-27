"use strict";

// IMPORTS ==================================================================================================
const { Router } = require("express");
const { userController } = require("../controllers");
const authentication = require("../middleware/authentication.middleware");


const router = new Router();
router.post("/register", userController.addUser);
router.post("/login", userController.userLogin);

// EXPORTS ==================================================================================================
module.exports = router;