const { Schema, model } = require("mongoose");

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
    report:[{
      type: Schema.Types.ObjectId,
      ref: 'Report'
    }]

  },
  { timestamps: true }
);

module.exports = model("users", UserSchema);
