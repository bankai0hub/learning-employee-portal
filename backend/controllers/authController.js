const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    res.status(201).json({
      success: true,
      message: "User Registered Successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

// Login
const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    console.log("Login Email:", email);

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    console.log("Users Found:", users);

    if (users.length === 0) {
      return res.status(400).json({
        message: "Invalid Credentials - User Not Found"
      });
    }

    const user = users[0];

    console.log("Stored Hash:", user.password);

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials - Password Incorrect"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

module.exports = {
  register,
  login
};