const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const { EMAIL, PASSWORD } = require('../env')
const otpMap = new Map();

const generateOTP = () => {
    // Generate a 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000);
};

const sendOtp = (req, res) => {

    const { email } = req.body;
    const otp = generateOTP();
    otpMap.set(email, otp);
    otpMap.forEach((value, key) => {
        console.log(`User: ${key}, OTP: ${value}`);
    });

    let config = {
        service : 'gmail',
        auth : {
            user: EMAIL,
            pass: PASSWORD
        }
    }

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: "default",
        product : {
            name: "Drivo Team :)",
            link : 'https://mailgen.js/'
        }
    })

    let response = {
        body: {
            name : "OTP verification",
            intro: "Next step!",
            outro: `Your OTP for login is: ${otp}.`,
        }
    }

    let mail = MailGenerator.generate(response)

    let message = {
        from : EMAIL,
        to : email,
        subject: "OTP verification",
        html: mail
    }

    transporter.sendMail(message).then(() => {
        return res.status(201).json({
            msg: "you should receive otp to the email"
        })
    }).catch(error => {
        return res.status(500).json({ error })
    })

    // res.status(201).json("getBill Successfully...!");
}


const verifyOTP=(req,res)=>{
    const enteredOTP = req.body.code;
    const email=req.body.email
    const storedOTP = otpMap.get(email);
    if (!storedOTP) {
        return res.status(400).json({ error: 'OTP not found in session' });
    }

    if (enteredOTP != storedOTP) {
        return res.status(401).json({ error: 'Invalid OTP' });
    }
else if(parseInt(enteredOTP)===parseInt(storedOTP)){
    // Clear OTP from session after successful verification
    otpMap.delete(email);

    res.status(200).json({ message: 'OTP verified successfully' });}
}

module.exports = {
    sendOtp,
    verifyOTP
}
