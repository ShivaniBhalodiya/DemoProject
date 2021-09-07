const router = require("express").Router();
const req = require("express/lib/request");
const res = require("express/lib/response");
const services = require('../services/render');


// Bring in the User Registration function
const {
  userAuth,
  userLogin,
  checkRole,
  userRegister,
  serializeUser
} = require("../controller/user.controller");

router.get('/', services.homeRoutes);

router.get('/welcome', (req,res)=>{
  res.render('welcome')
}
)

// router.get('/login',services.login_user)

router.post("/register-/:id", async (req, res) => {
  console.log("router called...")
  console.log()
  await userRegister(req,res,req.params.id);
});

//static route for register-user

// router.post("/register-user", async (req, res) => {
//   console.log("router called...")
//   console.log()
//   await userRegister(req,res,"user");
// });

// Admin Registration Route
router.post("/register-admin", async (req, res) => {
  await userRegister(req,res, "admin"); 
});

// Super Admin Registration Route)P
router.post("/register-super-admin", async (req, res) => {
  await userRegister(req,res, "superadmin");
});

// Users Login Route
router.post("/login-user", async (req, res) => {
  await userLogin(req,res, "user");
});

// Admin Login Route
router.post("/login-admin", async (req, res) => {
  await userLogin(req,res, "admin");
});

// Super Admin Login Route
router.post("/login-super-admin", async (req, res) => {
  await userLogin(req,res,"superadmin");
});

// Profile Route
router.get("/profile", userAuth, async (req, res) => {
  return res.json(serializeUser(req.user));
});

// Users Protected Route
router.get(
  "/user-protectd",
  userAuth,
  checkRole(["user"]),
  async (req, res) => {
    return res.json("Hello User");
  }
);

// Admin Protected Route
router.get(
  "/admin-protectd",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    return res.json("Hello Admin");
  }
);

// Super Admin Protected Route
router.get(
  "/super-admin-protectd",
  userAuth,
  checkRole(["superadmin"]),
  async (req, res) => {
    return res.json("Hello Super Admin");
  }
);

// Super Admin Protected Route
router.get(
  "/super-admin-and-admin-protectd",
  userAuth,
  checkRole(["superadmin", "admin"]),
  async (req, res) => {
    return res.json("Super admin and Admin");
  }
);



module.exports = router;
