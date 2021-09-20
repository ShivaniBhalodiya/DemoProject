const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/index");
const passport = require("passport");
const Report = require("../models/Report");
const { successResponse, errorResponse } = require("../helpers/helpers");
const {
  USER_NOT_EXIST,
  USER_ALREADY_EXIST,
  UNAUTHORIZED_PORTAL,
  EMAIL_ALREADY_EXIST,
  SUCCESSFULLY_REGISTERED,
  SOMETHING_WENT_WRONG,
  LOGIN_SUCCESSFULLY,
  INVALID_UNAME_PWORD,
} = require("../helpers/messages");
//@DEC to register the user(admin,user,superadmin)
const userRegister=async(req,res,employeetype)=>{
    try {
          var userDetails = req.body
    
        //validate username
        let userNotTaken=await validateUsername(userDetails.username);
        if(!userNotTaken)
        {
            return errorResponse(req,res,USER_ALREADY_EXIST,400)
        }
        //validate email
        let emailNotTaken=await validateEmail(userDetails.email);
        if(!emailNotTaken)
        {
            return errorResponse(req,res,EMAIL_ALREADY_EXIST,400)
        }

        //create new user
        const HashPassword=await bcrypt.hash(userDetails.password,12)
        /*
        const UserObject={
          name : req.body.name,
          username : req.body.username,
          email: req.body.email,
          employeetype:employeetype,
          phone: req.body.phone,
          totalexperience : req.body.totalexperience,
          password:HashPassword};
          */
        const NewUser=new User({
          name : req.body.name,
          username : req.body.username,
          email: req.body.email,
          employeetype:req.body.employeetype,
          phone: req.body.phone,
          totalexperience : req.body.totalexperience,
          password:HashPassword});
    console.log("Saved")  
    await NewUser.save();
   //Generate and set password reset token
   NewUser.generatePasswordReset();

   // Save the updated user object
   await NewUser.save();

    return res.redirect('/login');
        
    } catch (error) {
        console.log(error)
        return errorResponse(req,res,SOMETHING_WENT_WRONG,500)
    }
  
}

// for login
const userLogin=async(req,res)=>{
    let userCred = req.body
    
    let {username,password}=userCred;
    
    const user=await User.findOne({username})
    console.log("userrrrrrrrrr",user)
    let role = user.role

    console.log("userrr",user.role)
    //check username is in database or not
    if(!user)
    {
        return  errorResponse(req,res,USER_NOT_EXIST,400)
    }


    //check for password matching
    let isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // Sign in the token and issue it to the user
      let token = jwt.sign(
        {
          user_id: user._id,
          employeetype: user.employeetype,
          username: user.username,
          email: user.email
        },
        SECRET,
        { expiresIn: "7 days" }
      );
      console.log('login token',token);
  
      let result = {
        username: user.username,
        employeetype: user.employeetype,
        username: user.username,
        email: user.email,
        token: `Bearer ${token}`,
        expiresIn: 168
      };
      
      return res.redirect('/welcome');
    } else {
     
      return errorResponse(req,res,INVALID_UNAME_PWORD,400)
    }
  };

/*
 ***@DESC passport middleware
 */

const userAuth = passport.authenticate("jwt", { session: false });

// @route POST api/resend
// @desc Resend Verification Token
// @access Public
exports.resendToken = async (req, res) => {
  try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) return res.status(401).json({ message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});

      if (user.isVerified) return res.status(400).json({ message: 'This account has already been verified. Please log in.'});

      await sendVerificationEmail(user, req, res);
  } catch (error) {
      res.status(500).json({message: error.message})
  }
};

async function sendVerificationEmail(user, req, res){
  try{
      const token = user.generateVerificationToken();

      // Save the verification token
      await token.save();

      let subject = "Account Verification Token";
      let to = user.email;
      let from = process.env.FROM_EMAIL;
      let link="http://"+req.headers.host+"/verify/"+token.token;
      let html = `<p>Hi ${user.username}<p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p> 
                <br><p>If you did not request this, please ignore this email.</p>`;

      await sendEmail({to, from, subject, html});

      res.status(200).json({message: 'A verification email has been sent to ' + user.email + '.'});
  }catch (error) {
      res.status(500).json({message: error.message})
  }
}

const validateUsername = async (username) => {
  const user = await User.findOne({ username });
  return user ? false : true;
};

const validateEmail = async (email) => {
  const user = await User.findOne({ email });
  return user ? false : true;
};

const serializeUser = (user) => {
  return {
    username: user.username,
    email: user.email,
    firstname: user.firstname,
    _id: user._id,
  };
};

/**
 * @DESC Check Role Middleware
 */
const checkRole = (employeetype) => (req, res, next) =>
  !employeetype.includes(req.user.employeetype)
    ? res.status(401).json("Unauthorized")
    : next();

module.exports = {
  userRegister,
  userLogin,
  userAuth,
  serializeUser,
  checkRole,
};
