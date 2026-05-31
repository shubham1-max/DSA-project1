
const User = require("../models/user.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async function (req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "all fields required" });
    }

    const normalizedEmail = email.toLowerCase();

  const existinguser = await User.findOne({
  email: normalizedEmail,
});
    if (existinguser) {
      return res.status(400).json({ msg: "user already exist" });
    }

    // const salt = randomBytes(256).toString("hex");
    // const hashedpassword = createHmac("sha256", salt)
    //   .update(password)
    //   .digest("hex");

    const hashedpassword = await bcrypt.hash(password, 12);

    //create user and insert into database
    const user = await User.create({
      name,
      email:normalizedEmail,
      password: hashedpassword,
    });

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    // Generate token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(201).json({
      msg: "User created",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });

  } catch (err) {
      console.error(err);
    return res.status(500).json({ msg: "server error" });
  }
};

const login = async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and Password are required",
      });
    }

    const user = await User.findOne({  email: email.toLowerCase(), });

    if (!user) {
      return res.status(400).json({
        msg: "Please register first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        msg: "Invalid credentials",
      });
    }

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      msg: "Login successful",
      token,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Server Error",
    });
  }
};


const getMe = async function (req, res) {
  try {

    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

return res.status(200).json({
  id: user._id,
  name: user.name,
  email: user.email,
  streak: user.streak,
  longestStreak: user.longestStreak,
  totalSolved: user.totalSolved,
});

  } catch (err) {

    console.log(err);


    return res.status(500).json({

      error: "Server Error"
    });

  }
};



module.exports = {
  register,
  login,
  getMe,
};
