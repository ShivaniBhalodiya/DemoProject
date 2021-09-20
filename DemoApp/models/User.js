const { Schema, model } = require("mongoose");
const crypto = require('crypto');
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "superadmin"]
    },
    employeetype: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    phone:{
      type:String,
      required:true
    },
    totalexperience:{
      type:Number,
      required:true
    },
    resetPasswordToken: {
      type: String,
      required: false
  },

  resetPasswordExpires: {
      type: Date,
      required: false
  },
    report:[{
      type: Schema.Types.ObjectId,
      ref: 'Report'
    }]

  },
  { timestamps: true }
);

UserSchema.methods.generatePasswordReset = function() {
  this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};




module.exports = model("User", UserSchema);
