const uploadFile = require("../middlewares/upload");
const fs = require("fs");
const path=require('path')
const Report = require("../models/Report");
const mongoose=require('mongoose')
const uuid = require('uuid').v4;
const {
  successResponse,
  errorResponse}
  =require('../helpers/helpers')
const {
  PLEASE_SELECT_FILE,
  UPLOADED_SUCCESSFULLY,
  FILE_SIZE,COUDNT_UPLOAD}
  =require('../helpers/messages')
const upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.body.file == undefined) {
      return errorResponse(req,res,PLEASE_SELECT_FILE,400)
    }
      const data= await Report.find().populate("u_id").select("username")
      console.log(data);
    return successResponse(req,res,UPLOADED_SUCCESSFULLY,201)
    
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return errorResponse(req,res,FILE_SIZE,400)
    }

   return errorResponse(req,res,COUDNT_UPLOAD,500)
  }
};
/*
const id=uuid();
const ext=path.extname(file.originalname)
const filepath=`documents/${id}${ext}`


const report=new Report({
  u_id:new mongoose.Types.ObjectId()
})

report.save(function (err) {
  if (err) return handleError(err);
});
*/


module.exports={upload}