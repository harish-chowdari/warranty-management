const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const AdminSchema = require("../Models/AdminAuthModel.js");
const UserSchema = require("../Models/UserAuthModel.js");

// Helper function to generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Set up the Nodemailer transporter using Gmail SMTP configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465
  auth: {
    user: process.env.EMAIL_USER,       // Your email from .env
    pass: process.env.EMAIL_PASSWORD    // Your email password or app-specific password from .env
  }
});

async function AdminSigUp(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(200).json({ EnterAllDetails: "Please fill all the fields" });
    }

    const isUserExist = await AdminSchema.findOne({ email });
    if (isUserExist) { 
      return res.status(200).json({ AlreadyExist: "Account already exists" });
    }

    const data = new AdminSchema({
      name,
      email,
      password,
      otp: "",
      otpExpiresAt: "",
    });

    const savedUser = await data.save();
    return res.json(savedUser);
  } catch (error) {
    console.log(error);
  }
}

async function AdminLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(200).json({ EnterAllDetails: "Please fill all the fields" });
    }

    const admin = await AdminSchema.findOne({ email });
    if (!admin) {
      return res.status(200).json({ NotExist: "User does not exist" });
    }

    if (password !== admin.password) {
      return res.status(200).json({ Incorrect: "Incorrect password" });
    }

    // Generate OTP and set expiry (valid for 10 minutes)
    const verify2FAOtP = generateOTP();
    admin.verify2FAOtP = verify2FAOtP;
    admin.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await admin.save();

    // Email options for sending OTP
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: admin.email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${verify2FAOtP}`
    };

    // Send OTP email
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.error("Error sending email: ", err);
        return res.status(200).json({ error: "Error sending OTP email" });
      } else {
        return res.status(200).json({ message: "OTP sent to your email" });
      }
    });
  } catch (error) {
    console.log(error);
  }
}



const verifyAdminOTP = async (req, res) => {
  const {email, verify2FAOtP} = req.body;
  const admin = await AdminSchema.findOne({email});
  try {
    if (!admin) {
      return res.status(200).json({NotExist: "User does not exist"});
    }
    if (verify2FAOtP !== admin.verify2FAOtP) {
      return res.status(200).json({Incorrect: "Incorrect OTP"});
    }
    if (new Date() > admin.verify2FAOtPExpiresAt) {
      return res.status(200).json({Expired: "OTP has expired"});
    }
    return res.status(200).json({message: "OTP verified, login successful"});
  } catch (error) {
    console.log(error);
  }
};

async function UserSigUp(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(200).json({ EnterAllDetails: "Please fill all the fields" });
    }

    const isUserExist = await UserSchema.findOne({ email });
    if (isUserExist) { 
      return res.status(200).json({ AlreadyExist: "Account already exists" });
    }

    const data = new UserSchema({
      name,
      email,
      password,
      otp: "",
      otpExpiresAt: "",
    });

    const savedUser = await data.save();
    return res.json(savedUser);
  } catch (error) {
    console.log(error);
  }
}

async function UserLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(200).json({ EnterAllDetails: "Please fill all the fields" });
    }

    const user = await UserSchema.findOne({ email });
    if (!user) {
      return res.status(200).json({ NotExist: "User does not exist" });
    }

    if (password !== user.password) {
      return res.status(200).json({ Incorrect: "Incorrect password" });
    }

    // Generate OTP and set expiry (valid for 10 minutes)
    const verify2FAOtP = generateOTP();
    user.verify2FAOtP = verify2FAOtP;
    user.verify2FAOtPExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Email options for sending OTP
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${verify2FAOtP}`
    };

    // Send OTP email
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.error("Error sending email: ", err);
        return res.status(200).json({ error: "Error sending OTP email" });
      } else {
        return res.status(200).json({ message: "OTP sent to your email", userId: user._id });
      }
    });
  } catch (error) {
    console.log(error);
  }
}


const verifyUserOTP = async (req, res) => {
  const {email, verify2FAOtP} = req.body;
  const user = await UserSchema.findOne({email});
  try {
    if (!user) {
      return res.status(200).json({NotExist: "User does not exist"});
    }
    if (verify2FAOtP !== user.verify2FAOtP) {
      return res.status(200).json({Incorrect: "Incorrect OTP"});
    }
    if (new Date() > user.verify2FAOtPExpiresAt) {
      return res.status(200).json({Expired: "OTP has expired"});
    }
    return res.status(200).json({message: "OTP verified, login successful"});
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  AdminSigUp,
  AdminLogin,
  verifyAdminOTP,
  UserSigUp,
  UserLogin,
  verifyUserOTP
};
