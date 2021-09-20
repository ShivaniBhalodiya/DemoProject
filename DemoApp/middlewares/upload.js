const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;
const path = require('path');
const uuid = require('uuid').v4;
const FileType = require('file-type');
const Report=require('../models/Report');
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,"upload");
  },
  filename: (req, file, cb) => {
    console.log("file name"+file.originalname)
    const ext=path.extname(file.originalname)
    const id=uuid();
    const filepath=`documents/${id}${ext}`; 
    console.log(filepath)
     (async()=>{
      await Report.create({filepath})
      .then(()=>{
      cb(null,filepath)
    })();
     }) 
    console.log(data);

  

    console.log(file.originalname);
    cb(null, file.originalname);
  },
  
});

/*
const fileFilter = function(req, file, cb) {
    Accept doc|pdf only
    if (!file.originalname.match(/\.(png|jpg|pdf|doc|docx)$/)) {
        req.fileValidationError = 'Only doc or pdf  files are allowed!';
        return cb(new Error('Only doc or pdf files are allowed!'), false);
    }
    cb(null, true);
    console.log(req.file.path)
    const meta = await FileType.fromFile(req.file.path)
    console.log(meta)
    if (!whitelist.includes(meta.mime)) {
        
      return cb(new Error('Only doc or pdf files are allowed!'), false);
        // return cb(new Error('Only doc or pdf files are allowed!'), false);
    }
    cb(null, true);   

};
*/
var uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize }
}).any()

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;