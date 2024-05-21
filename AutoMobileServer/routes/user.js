const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { sendOtp, verifyOTP } = require('../controller/user');
const router = new express.Router();

router.post('/sendOTP',sendOtp)
router.post('/verifyOTP',verifyOTP)


// // Create a user
router.post('/users/register', async (req, res) => {
  try {
    // const {role} = req.body;
    // if (role) throw new Error('you cannot set role property.');
    const user = new User(req.body);
    await user.save();
    console.log(user.password)
    // const token = await user.generateAuthToken();
    // const refresh=await user.generateRefreshToken();
    // res.send(user)
    // console.log(refresh)
    res.status(201).send({ user });
  } catch (e) {
    res.send(e);
  }
});



// // Login User
router.post('/users/login', async (req, res) => {
  const email=req.body.email
  const password=req.body.password
  try {
    const user = await User.findByCredentials(email, password);
    // const token = await user.generateAuthToken();
    // const refresh=await user.generateRefreshToken();
    res.send({ user});
  } catch (e) {
    res.status(400).send({
      error: { message: 'You have entered an invalid email or password' },
    });
  }
});


module.exports = router;

