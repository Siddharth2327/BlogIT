const express = require('express');
const router = express.Router();
const userModel = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');


// Register route
router.post('/register', async (req, res) => {
  try {
    // Check if user exists by email only
    const userExists = await userModel.findOne({ email: req.body.email });

    if (userExists) {
      return res.status(400).send({
        success: false,
        message: "User already exists"
      });
    }

    // console.log("Received register body:", req.body);
    // Salting and hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hashedPassword;

    // Create it as an userModel and save it to the DB
    const newUser = await userModel(req.body);
    await newUser.save();

    return res.status(200).send({
      success: true,
      message: "User registered successfully"
    });

  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Error while registering user",
      error: err.message
    });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    // Find user by email only
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User does not exist"
      });
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);

    if (!isValidPassword) {
      return res.status(401).send({
        success: false,
        message: "Invalid credentials"
      });
    }

    // creating JWT token
    const jwtToken = jwt.sign({userId:user._id}, 'BlogIT', {expiresIn:'2d'}) // center one is the secret key for our app

    return res.status(200).send({
      success: true,
      message: "Login successful",
      token:jwtToken
    });

  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err.message

    });
  }
});

// token validation route
router.get("/validate-user", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send({ success: false, message: "Unauthorized access" });
    }

    const validUser = await userModel.findById(req.user).select("-password");
    
    if (!validUser) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    return res.status(200).send({
      success: true,
      message: "User successfully verified",
      data: validUser,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Error validating user", error });
  }
});

module.exports = router;