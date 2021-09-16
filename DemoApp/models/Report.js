const {Schema,model}=require('mongoose')
const User=require('../models/User')
const mongoose=require('mongoose')
const Report_schema=new Schema({
    filepath:{
        type:String,
    },
    filename:{
        type:String,
    }
    
})
module.exports=model('Report',Report_schema)

