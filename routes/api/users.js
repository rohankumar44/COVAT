const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateUserLocationDetails = require("../../validation/userlocation");
const validateChangePassword = require("../../validation/changePassword");
const validateShopDetails = require("../../validation/shopDetails");
const User = require("../../models/User");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req,file,cb) {
    cb(null,'./uploads/');
  },
  filename: function(req,file,cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req,file,cb) => {
  if(file.mimetype == 'image/png' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg'){
    cb(null,true);
  } else {
    cb(new Error('Only png and jpeg files are supported'), false);
  }
}
const upload= multer({storage: storage,
  fileFilter: fileFilter
});

router.get('/', (req,res)=>{
  User.find({shopkeeper: "yes", available: { $gt: 0 }})
    .then(docs => {
      const response = {
        users : docs.map(doc => {
          return {
            name: doc.name,
            email: doc.email,
            shopkeeper: doc.shopkeeper,
            address: doc.address,
            shopName: doc.shopName,
            contactNumber: doc.contactNumber,
            available: doc.available,
            sold: doc.sold,
            id: doc._id,
            price: doc.price
          }
        })
      };
      res.status(200).json(response);
    })
    .catch(err => console.log(err));
})

router.post("/register", (req, res) => {
    
  const { errors, isValid } = validateRegisterInput(req.body);
  
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
          password: req.body.password,
          shopkeeper: req.body.shopkeeper
        });
  
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

router.post("/login", (req, res) => {
    
  const { errors, isValid } = validateLoginInput(req.body);
  
    if (!isValid) {
      return res.status(400).json(errors);
    }
  const email = req.body.email;
    const password = req.body.password;
  
    User.findOne({ email }).then(user => {
      
      if (!user) {
        return res.status(404).json({ emailnotfound: "Email not found" });
      }
  
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            shopkeeper: user.shopkeeper
          };
  
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926 
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

  router.put('/updatedetails', (req,res) => {
    if(req.body.id.charAt(0) === " "){
      req.body.id = req.body.id.slice(1);
      const { errors, isValid } = validateShopDetails(req.body);
      if (!isValid) {
        return res.status(400).json(errors);
      }
      User.find()
        .then(users => {
          users.map(user => {
            const newCart = user.shopping.cart.map(item => {
              if(item.shopkeeperId === req.body.id){
                item.available = req.body.available;
                item.price = req.body.price;
                item.shopName = req.body.shopName
                return item;
              }
            });
            user.shopping.cart = newCart;
            user.save()
              .then(updatedUser => {
                User.findOne({ _id: req.body.id }).then(newuser => {
                  newuser.contactNumber = req.body.contactNumber;
                  newuser.price = req.body.price;
                  newuser.available = req.body.available;
                  newuser.shopName = req.body.shopName;
                  newuser.sold = req.body.sold;
                  newuser.save().then(result => res.status(200).json({
                    updatedUser: updatedUser,
                    result: result
                  }))
                  .catch(err => console.log(err));
                })
              })
              .catch(err => console.log(err));
          })
        })
        .catch(err => console.log(err));
    }
    else {
      const { errors, isValid } = validateUserLocationDetails(req.body.address);

      if (!isValid) {
        return res.status(400).json(errors);
      }

      User.findByIdAndUpdate({
        _id: req.body.id
      },req.body,function(err,result){
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      });
    }

  })

  router.delete('/invaliduser/:id',(req,res) =>{
    const rohan = {
      shopkeeper: "yes",
      address: {
        locality: "",
        landmark: "",
        state: "",
        pin: "",
        country: "",
        latitude: 37.7577,
        longitude: -122.4376
      }
    }
    if(req.params.id == "1"){
      User.deleteOne(rohan).then(response=>{
        res.json(response);
      })
    } else {
      User.findByIdAndDelete(req.params.id, function(err,result){
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      })
    }
  })

  router.get('/userdetails/:id',(req,res) => {
    User.findOne({_id: req.params.id}).then(user =>{
      res.status(200).json(user);
    })
    .catch(err => console.log(err));
  })

  router.put('/changepassword',(req,res)=> {

    const { errors, isValid } = validateChangePassword(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email}).then(user => {
      bcrypt.compare(req.body.currentpassword,user.password)
        .then(isMatch => {
          if(isMatch) {
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(req.body.newpassword, salt, (err, hash) => {
                if (err) throw err;
                User.findByIdAndUpdate({
                  _id:req.body.id
                },{
                  password: hash
                },function(err,result){
                  if (err) {
                    console.log(err);
                  } else {
                    res.send(result);
                  }
                })
              });
            });
          } else {
            return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
          }
        })
    })
  })

  router.put('/images', upload.single('userImage'), (req,res) => {
    User.findOne({
      _id: req.body.id
    }).then(user => {
      user.userImage = req.file.path;
      user.save()
        .then(updatedUser => res.json(updatedUser))
        .catch(err => console.log(err));
    })
  })

  module.exports = router;
