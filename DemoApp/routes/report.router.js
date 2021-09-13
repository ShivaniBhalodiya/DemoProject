const express = require("express");
const router = express.Router();
const {upload} = require("../controller/report.controller");
const {userAuth}=require('../controller/user.controller')

 router.post('/upload',upload);

module.exports =router;