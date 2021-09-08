const express = require("express");
const router = express.Router();
const {upload} = require("../controller/report.controller");
const {userAuth}=require('../controller/user.controller')

 router.post('/upload',userAuth,upload
 //(req, res) => {
//     // Create post and saving
//         _id: req.params.id;
//         var report = new Report({
//             title: req.body.title,
//             u_id: _id
//     })

//     report.save().then(post => {
//         res.send(post);
//     }, (e) => {
//         res.status(400).send(e);
// }
//     },
);

module.exports =router;