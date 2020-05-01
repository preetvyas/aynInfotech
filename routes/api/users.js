const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const ScreenShot =require("../../models/ScreenShort")
var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dxthmh1wc',
    api_key: '854829342212346',
    api_secret: 'wRvoto2ZAnwYhsQSi4WNl_49jkU'
});
// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});
router.post("/file",(req,res)=>{
  //ScreenShot
  let transformationData = {}
  let ImagePath = req.body.file;
  transformationData = {
    folder: "AynInfotech/", timeout: 60000
    // transformation: [{ angle: req.fields.vAngle }, { timeout: 60000 }]
}
  cloudinary.v2.uploader.upload(ImagePath, transformationData,
    function (error, result) {
      console.log(error,'error')
        if (error) {
            res.end(JSON.stringify({
                type: false,
                message: error
            }));
        }
        else {
            let Image = result.public_id + '.' + result.format;
            var data ={
                image:Image,
                userId:ObjectId(req.body.userId)
              }
              ScreenShot.create(data).then(user => {
                res.json(user)
              }) .catch(err => console.log(err,'catch'));;
          }
        })
  //
})
// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});
router.post("/list", (req, res) => {
  // Form validation


  ScreenShot.aggregate([
    { "$lookup": {
         "from": "users",
         "localField": "userId",
         "foreignField": "_id",
         "as": "user"
       }},
       { "$unwind": "$user" },
       { "$project":{
           id:1,
           image:1,
           name:"$user.name"
           }
       }
   ]).then(user => {
    return res.status(200).json(user)
    // Check if user exists
 
  }).catch((error)=>{
   console.log(error,'@@@@@')
  });
});
module.exports = router;
