const db = require("../config/db");

// Mark Attendance
const markAttendance = async (req, res) => {
  try {

    const {
      registration_id,
      attendance_date,
      status
    } = req.body;

    const [registrations] = await db.query(
      "SELECT * FROM registrations WHERE id = ?",
      [registration_id]
    );

    if (registrations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Registration Not Found"
      });
    }

    const [result] = await db.query(
      `INSERT INTO attendance
      (registration_id, attendance_date, status)
      VALUES (?, ?, ?)`,
      [
        registration_id,
        attendance_date,
        status
      ]
    );

    res.status(201).json({
      success: true,
      message: "Attendance Marked Successfully",
      attendanceId: result.insertId
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


// Update Attendance
const updateAttendance = async (req, res) => {
  try {

    const { id } = req.params;

    const { status } = req.body;

    const [result] = await db.query(
      `UPDATE attendance
       SET status = ?
       WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Attendance Record Not Found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance Updated Successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


// Employee Attendance
const getMyAttendance = async (req, res) => {
  try {

    const userId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT
      a.id,
      a.attendance_date,
      a.status,
      p.title

      FROM attendance a

      JOIN registrations r
      ON a.registration_id = r.id

      JOIN programs p
      ON r.program_id = p.id

      WHERE r.user_id = ?
      `,
      [userId]
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      attendance: rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


// Program Attendance Report
const getProgramAttendance = async (req, res) => {
  try {

    const { programId } = req.params;

    const [rows] = await db.query(
      `
      SELECT
      a.id,
      a.attendance_date,
      a.status,
      u.name,
      u.email

      FROM attendance a

      JOIN registrations r
      ON a.registration_id = r.id

      JOIN users u
      ON r.user_id = u.id

      WHERE r.program_id = ?
      `,
      [programId]
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      attendance: rows
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
  markAttendance,
  updateAttendance,
  getMyAttendance,
  getProgramAttendance
};