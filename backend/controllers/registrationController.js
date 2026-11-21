const db = require("../config/db");

// Register For Program
const registerProgram = async (req, res) => {
  try {

    const userId = req.user.id;
    const { program_id } = req.body;

    // Check Program Exists
    const [programs] = await db.query(
      "SELECT * FROM programs WHERE id = ?",
      [program_id]
    );

    if (programs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Program Not Found"
      });
    }

    const program = programs[0];

    // Check Program Status
    if (program.status === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Cannot Register For Completed Program"
      });
    }

    // Check Capacity
    const [countResult] = await db.query(
      `SELECT COUNT(*) AS total
       FROM registrations
       WHERE program_id = ?
       AND status = 'REGISTERED'`,
      [program_id]
    );

    if (countResult[0].total >= program.capacity) {
      return res.status(400).json({
        success: false,
        message: "Program Capacity Full"
      });
    }

    // Register User
    await db.query(
      `INSERT INTO registrations
       (user_id, program_id)
       VALUES (?, ?)`,
      [userId, program_id]
    );

    res.status(201).json({
      success: true,
      message: "Registration Successful"
    });

  } catch (error) {

    // Duplicate Registration Error
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Already Registered For This Program"
      });
    }

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// Cancel Registration
const cancelRegistration = async (req, res) => {
  try {

    const { id } = req.params;

    const [result] = await db.query(
      `UPDATE registrations
       SET status = 'CANCELLED'
       WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Registration Not Found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Registration Cancelled"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// My Registrations
const getMyRegistrations = async (req, res) => {
  try {

    const userId = req.user.id;

    const [rows] = await db.query(
      `SELECT
          r.id,
          r.status,
          r.registration_date,
          p.title,
          p.trainer_name,
          p.start_date,
          p.end_date
       FROM registrations r
       JOIN programs p
       ON r.program_id = p.id
       WHERE r.user_id = ?`,
      [userId]
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      registrations: rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// View All Registrations (Admin)
const getAllRegistrations = async (req, res) => {
  try {

    const [rows] = await db.query(
      `SELECT
        r.id,
        r.status,
        r.registration_date,
        u.name,
        u.email,
        p.title
       FROM registrations r
       JOIN users u ON r.user_id = u.id
       JOIN programs p ON r.program_id = p.id`
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      registrations: rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

module.exports = {
  registerProgram,
  cancelRegistration,
  getMyRegistrations,
  getAllRegistrations
};