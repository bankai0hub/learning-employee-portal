const db = require("../config/db");

const getUsers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database Error"
    });
  }
};

module.exports = {
  getUsers
};