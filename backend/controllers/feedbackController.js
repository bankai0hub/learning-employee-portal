const db = require("../config/db");

// Submit Feedback
const submitFeedback = async (req, res) => {
  try {

    const {
      registration_id,
      quality_rating,
      trainer_rating,
      relevance_rating,
      comments
    } = req.body;

    const [registration] = await db.query(
      "SELECT * FROM registrations WHERE id = ?",
      [registration_id]
    );

    if (registration.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Registration Not Found"
      });
    }

    const [result] = await db.query(
      `INSERT INTO feedback
      (
        registration_id,
        quality_rating,
        trainer_rating,
        relevance_rating,
        comments
      )
      VALUES (?, ?, ?, ?, ?)`,
      [
        registration_id,
        quality_rating,
        trainer_rating,
        relevance_rating,
        comments
      ]
    );

    res.status(201).json({
      success: true,
      message: "Feedback Submitted Successfully",
      feedbackId: result.insertId
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


// Employee Feedback
const getMyFeedback = async (req, res) => {
  try {

    const userId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT
      f.id,
      f.quality_rating,
      f.trainer_rating,
      f.relevance_rating,
      f.comments,
      p.title

      FROM feedback f

      JOIN registrations r
      ON f.registration_id = r.id

      JOIN programs p
      ON r.program_id = p.id

      WHERE r.user_id = ?
      `,
      [userId]
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      feedback: rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


// Admin View All Feedback
const getAllFeedback = async (req, res) => {
  try {

    const [rows] = await db.query(
      `
      SELECT
      f.id,
      f.quality_rating,
      f.trainer_rating,
      f.relevance_rating,
      f.comments,
      u.name,
      p.title

      FROM feedback f

      JOIN registrations r
      ON f.registration_id = r.id

      JOIN users u
      ON r.user_id = u.id

      JOIN programs p
      ON r.program_id = p.id
      `
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      feedback: rows
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
  submitFeedback,
  getMyFeedback,
  getAllFeedback
};