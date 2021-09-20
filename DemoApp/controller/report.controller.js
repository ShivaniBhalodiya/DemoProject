const uploadFile = require("../middlewares/upload");
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
      
const path=require('path')
const Report = require("../models/Report");
const User = require("../models/User")
const mongoose=require('mongoose')
const FileType = require('file-type');
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

  const whitelist = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
const upload = async (req, res,next) => {
  try {
      console.log(req.files)
      
        req.files.forEach(async (file)=>{
        console.log('path',file.path);
        const meta = await FileType.fromFile(file.path)
        console.log("mmetta",meta)
        if (!whitelist.includes(meta.mime)) 
        {
          await unlinkAsync(file.path)
          return res.send('file is not allowed')
        }
        else{
            const ext=path.extname(file.originalname)
            const id=uuid();
            const filepath=`documents/${id}${ext}`; 
            const newReport = await Report.create({filename:file.originalname,filepath:filepath}).then(function(dbReview) {
              console.log("Db Review",dbReview)
               return User.findOneAndUpdate({ _id: req.params.id }, {$push: {report: dbReview._id}}, { new: true });
            })
            return successResponse(req,res,UPLOADED_SUCCESSFULLY,201)
        }
      }
        
      )
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return errorResponse(req,res,FILE_SIZE,400)
    }

   return errorResponse(req,res,COUDNT_UPLOAD,500)
  }
}
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