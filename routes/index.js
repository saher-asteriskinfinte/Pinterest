var express = require('express');
var router = express.Router();
const passport = require("passport");
const userModel = require("./user");
const postModel = require("./post");
const localStrategy = require("passport-local");
const upload = require("./multer");

passport.use(new localStrategy(userModel.authenticate()));

router.get('/',async function(req, res) {
  res.render('index')
});
router.get('/show/posts',isLoggedIn,async function(req, res) {
  const user = await userModel.findOne({username:req.session.passport.user})
  .populate("posts");
  res.render('show',{user})
});

router.get("/feed",isLoggedIn,async(req,res)=>{
const user = await userModel.findOne({username:req.session.passport.user});
const posts = await postModel.find()
.populate("user");
posts.forEach(p => {
  console.log("posts:",p.title,"user:",p.user);
});
res.render("feed",{user,posts});
})

router.get("/profile", isLoggedIn, async function(req, res) {
  const user = 
  await userModel
  .findOne({username:req.session.passport.user})
  .populate("posts");
  console.log(user);
  res.render("profile", { user });
});

router.post("/register", async function(req, res, next) {
  try {
    const data = new userModel({
      username: req.body.username,
      email: req.body.email,
      fullname:req.body.fullname,
      profileImage: "default.jpg",
    });

    const user = await userModel.register(data, req.body.password);

    req.login(user, function(err) {
      if (err) return next(err);
      res.redirect("/profile");
    });
  } catch (err) {
    console.log(err);
    res.redirect("/register");
  }
});

// Add this route - specifically for profile image upload
router.post("/profileimage", isLoggedIn, upload.single("image"), async function(req, res) {
    try {
        if (!req.file) {
            req.flash("error", "No file uploaded");
            return res.redirect("/profile");
        }
        
        const user = await userModel.findOne({username: req.session.passport.user});
        
        // Update the user's profileImage field
        user.profileImage = req.file.filename;
        await user.save();
        
        res.redirect("/profile");
    } catch (error) {
        console.log(error);
        res.redirect("/profile");
    }
});

router.get("/register",(req,res)=>{
  res.render("register");
})

router.post("/createpost",isLoggedIn,upload.single("image"),async function(req, res) {
    const user = await userModel.findOne({username:req.session.passport.user});
    const post = await postModel.create({
      user:user._id,
      title:req.body.title,
      description:req.body.description,
      image:req.file.filename,
     })
     user.posts.push(post._id);
     await user.save();
     res.redirect("/profile");
  });

router.get("/add",isLoggedIn,(req,res)=>{
  res.render("add");
})



router.post('/login', passport.authenticate("local",{
  failureRedirect:"/",
  successRedirect:"/profile"
}) ,function(req, res) {});

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req,res,next){
if(req.isAuthenticated()){
  return next();
}
else res.redirect("/");
}

module.exports = router;
