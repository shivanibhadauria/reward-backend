const cookieParser = require('cookie-parser');
const express = require('express');
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const crypto = require('crypto');

const sendMail = require('../utils/mailer');


// forgot password reset
router.post('/forgot-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        // Find the admin by reset token
        const admin = await Admin.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the admin's password and clear the reset token
        admin.password = hashedPassword;
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpires = undefined;
        await admin.save();

        res.status(200).json({ message: 'Password reset successful' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error resetting password' });
    }
    
})

// forgot password

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the email exists in the database
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiration = Date.now() + 3600000000; // 1 hour 
        // Save the reset token and expiration in the database
        admin.resetPasswordToken = resetToken;
        admin.resetPasswordExpires = resetTokenExpiration;
        await admin.save();

        // Send the reset token to the user's email
        const resetURL = `http://localhost:3000/forgot-password/${resetToken}`;

        const html = `
            <p>You have requested to reset your password.</p>
            <p>Click the following link to reset your password:</p>
            <a href="${resetURL}">Reset Password</a>
        `;

        // Send the email using your preferred email service
        await sendMail({
            to: email,
            subject: 'Password Reset',
            html,
        })

        res.status(200).json({ message: 'Password reset email sent' }); 



    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error sending password reset email' });
    }
})

// Admin registration
router.post('/register', async (req, res) => {

    const { username,  email , password } = req.body;

   

    try {
        // Check if the username is already taken
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Username already exists' });
        }

         // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
   

        await Admin.create({
            username,
            email,
            password : hashedPassword,
        })

        

        res.status(200).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error registering admin' });
    }
})

// Admin login
router.post('/login', async (req, res) => {
    const {  email, password} = req.body;

    try{
      
        
        const exist = await Admin.findOne({email});
        if(!exist ){
            return res.status(400).json({message: email + " is not registered"});
        }

        const isMatch = await bcrypt.compare(password, exist.password);


       
        if(!isMatch){
            return res.status(400).json({message: "wrong password"});
        }

        console.log("🔑 Password match:", isMatch);

        const token = jwt.sign({id: exist._id}, process.env.JWT_SECRET, {expiresIn: "1h"});

        res.cookie('token', token, {httpOnly: true, secure:true, sameSite:"none",  maxAge: 7 * 24 * 60 * 60 * 1000});

        console.log("exist._id:", exist._id);
        console.log("JWT_SECRET:", process.env.JWT_SECRET);
        console.log("🔑 Token:", token);
        res.status(200).json({token, message: "Logged in successfully"});
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Error logging in"});}

    
})

module.exports = router;