const cors = require("cors");
const exp = require("express");
const passport = require("passport");
const { connect } = require("mongoose");
const { success, error } = require("consola");
const path = require("path")
const bodyParser = require('body-parser')
// Bring in the app constants
const { DB } = require("./config");
const express = require("express");

// Initialize the application
const app = exp();
app.use(bodyParser.urlencoded({ extended: false }))
// Middlewares
app.set("view engine","ejs")

app.use('/css',express.static(path.resolve(__dirname,"assets/css")))
app.use('/images',express.static(path.resolve(__dirname,"assets/images")))
app.use('/js',express.static(path.resolve(__dirname,"assets/js")))
app.use('/scss',express.static(path.resolve(__dirname,"assets/scss")))
app.use('/vendor',express.static(path.resolve(__dirname,"assets/vendor")))
app.use('/fonts',express.static(path.resolve(__dirname,"assets/fonts")))
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

const PORT = 5000
    
require("./middlewares/passport")(passport);

//use Middleware
global.__basedir = __dirname;

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// User Router Middleware
app.use("/", require("./routes/users.router"));
app.use('/api/users',require('./routes/report.router'))

let counter = 0;
const startApp = async () => {
  try {
    counter++;
    console.log(counter)
    console.log("called")
    // Connection With DB
    await connect(DB, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });

    // Start Listenting for the server on PORT
    app.listen(PORT, () =>
      success({ message: `Server is running on http://localhost:${PORT}`, badge: true })
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
        startApp();
      }, 1000);
      clearTimeout(intervalObj);
     }
     
     startApp();
    //  process.exit()
    }

}

startApp();

app.get('/',(req,res)=>{
  res.render('index')
})

app.get('/login',(req,res)=>{
  res.render('login')
})



