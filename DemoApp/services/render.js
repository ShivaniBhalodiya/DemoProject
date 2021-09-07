const axios = require('axios')
const {
    successResponse,
    errorResponse,
  } = require('../helpers/helpers');
  const {

    SOMETHING_WENT_WRONG,

  } = require('../helpers/messages');
  
exports.homeRoutes = (req,res)=>{
    res.render('index')
}

exports.login_user = (req,res)=>{
    try{
        
        const user = await.axios.get('localhost:5000/api/users/login-user')
        console.log()
        return (user)
    }
    catch(err){
        return errorResponse(req,res,SOMETHING_WENT_WRONG,500)
    }
    
}