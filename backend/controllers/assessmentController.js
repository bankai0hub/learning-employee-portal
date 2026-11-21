const db = require("../config/db");

// Add Assessment
const addAssessment = async (req, res) => {
  try {

    const { registration_id, score } = req.body;

    const result = score >= 40 ? "PASS" : "FAIL";

    const [registration] = await db.query(
      "SELECT * FROM registrations WHERE id=?",
      [registration_id]
    );

    if (registration.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Registration Not Found"
      });
    }

    const [insertResult] = await db.query(
      `INSERT INTO assessments
      (registration_id, score, result)
      VALUES (?, ?, ?)`,
      [registration_id, score, result]
    );

    res.status(201).json({
      success: true,
      message: "Assessment Added Successfully",
      assessmentId: insertResult.insertId
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


// Update Assessment
const updateAssessment = async (req, res) => {
  try {

    const { id } = req.params;

    const { score } = req.body;

    const result = score >= 40 ? "PASS" : "FAIL";

    const [updateResult] = await db.query(
      `UPDATE assessments
       SET score=?, result=?
       WHERE id=?`,
      [score, result, id]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Assessment Not Found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Assessment Updated Successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


// Employee Results
const getMyAssessments = async (req, res) => {
  try {

    const userId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT
      a.id,
      a.score,
      a.result,
      p.title

      FROM assessments a

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
      assessments: rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


// Admin View All
const getAllAssessments = async (req, res) => {
  try {

    const [rows] = await db.query(
      `
      SELECT
      a.id,
      a.score,
      a.result,
      u.name,
      p.title

      FROM assessments a

      JOIN registrations r
      ON a.registration_id = r.id

      JOIN users u
      ON r.user_id = u.id

      JOIN programs p
      ON r.program_id = p.id
      `
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      assessments: rows
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
  addAssessment,
  updateAssessment,
  getMyAssessments,
  getAllAssessments
};