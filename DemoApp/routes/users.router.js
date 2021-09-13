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

router.post("/register", async (req, res) => {
  console.log("router called...")
  console.log(req.body.role)
  await userRegister(req,res,req.body.role);
});

// Users Login Route
router.post("/login", async (req, res) => {
  await userLogin(req,res);
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
