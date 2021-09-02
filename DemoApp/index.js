const cors = require("cors");
const exp = require("express");
const passport = require("passport");
const { connect } = require("mongoose");
const { success, error } = require("consola");

// Bring in the app constants
const { DB, PORT } = require("./config");
const express = require("express");

// Initialize the application
const app = exp();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

require("./middlewares/passport")(passport);

var counter = 0;

// User Router Middleware
app.use("/api/users", require("./routes/users.router"));

const startApp = async () => {
  try {
    counter++;
    console.log(counter)
    console.log("called")
    // Connection With DB
    await connect(DB, {
      useFindAndModify: true,
      useUnifiedTopology: true,
      useNewUrlParser: true
    });

    success({
      message: `Successfully connected with the Database \n${DB}`,
      badge: true
    });

    // Start Listenting for the server on PORT
    app.listen(PORT, () =>
      success({ message: `Server started on PORT ${PORT}`, badge: true })
    );
  } catch (err) {
    error({
      message: `Unable to connect with Database \n${err}`,
      badge: true
    });

    if(counter==10){
      console.log("counter exceed")
      counter = 0
      const intervalObj = setTimeout(() => {
        StartApp();
      }, 1000);
      clearTimeout(intervalObj);
     }
     
     startApp();
    }
    
};

startApp();
