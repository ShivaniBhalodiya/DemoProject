const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadFile = require("../middlewares/upload");
const {upload} = require("../controller/report.controller");
const {userAuth}=require('../controller/user.controller')
const FileType = require('file-type');
const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)

const {
    successResponse,
    errorResponse}
    =require('../helpers/helpers')

    const {
        PLEASE_SELECT_FILE,
        UPLOADED_SUCCESSFULLY,
        FILE_SIZE,COUDNT_UPLOAD}
        =require('../helpers/messages')
      
        const whitelist = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ]
          
// router.post('/upload',uploadFile,upload);
router.post('/upload',uploadFile,async (req, res,next) => {
    try {
        console.log(req.file)
        const meta = await FileType.fromFile(req.file.path)
        console.log(meta)
        if (!whitelist.includes(meta.mime)) {
            await unlinkAsync(req.file.path)
            return res.send('file is not allowed')
        }
      return successResponse(req,res,UPLOADED_SUCCESSFULLY,201)
      
    } catch (err) {
      console.log(err);
  
      if (err.code == "LIMIT_FILE_SIZE") {
        return errorResponse(req,res,FILE_SIZE,400)
      }
  
     return errorResponse(req,res,COUDNT_UPLOAD,500)
    }
  });


module.exports =router;