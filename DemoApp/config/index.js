require('dotenv').config();
module.exports={
    DB:process.env.APP_DB,
    PORT:process.env.PORT,
    SECRET:process.env.APP_SECRET,
    SENDGRID_API_KEY:process.env.SENDGRID_API_KEY,
    FROM_EMAIL:process.env.FROM_EMAIL
}