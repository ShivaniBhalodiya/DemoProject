const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadFile = require("../middlewares/upload");
const {upload} = require("../controller/report.controller");
const {userAuth}=require('../controller/user.controller')
const FileType = require('file-type');
          
// router.post('/upload',uploadFile,upload);
router.post('/upload',uploadFile,upload);


module.exports =router;