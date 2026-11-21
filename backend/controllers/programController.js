const db = require("../config/db");

// Get All Programs
// Get All Programs + Search + Filter
const getPrograms = async (req, res) => {
  try {

    const search = req.query.search || "";
    const status = req.query.status || "";
    const trainer = req.query.trainer || "";

    let query = `
      SELECT *
      FROM programs
      WHERE 1=1
    `;

    const params = [];

    // Search by Program Title
    if (search) {
      query += " AND title LIKE ?";
      params.push(`%${search}%`);
    }

    // Filter by Status
    if (status) {
      query += " AND status = ?";
      params.push(status);
    }

    // Filter by Trainer Name
    if (trainer) {
      query += " AND trainer_name LIKE ?";
      params.push(`%${trainer}%`);
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await db.query(
      query,
      params
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      programs: rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
// Get Program By ID
const getProgramById = async (req, res) => {
  try {

    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM programs WHERE id=?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Program Not Found"
      });
    }

    res.status(200).json({
      success: true,
      program: rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// Create Program
const createProgram = async (req, res) => {
  try {

    const {
      title,
      description,
      trainer_name,
      start_date,
      end_date,
      capacity,
      status
    } = req.body;

    if (
      !title ||
      !trainer_name ||
      !start_date ||
      !end_date ||
      !capacity
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    const [result] = await db.query(
      `INSERT INTO programs
      (
        title,
        description,
        trainer_name,
        start_date,
        end_date,
        capacity,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        trainer_name,
        start_date,
        end_date,
        capacity,
        status || "ACTIVE"
      ]
    );

    res.status(201).json({
      success: true,
      message: "Program Created Successfully",
      programId: result.insertId
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// Update Program
const updateProgram = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      title,
      description,
      trainer_name,
      start_date,
      end_date,
      capacity,
      status
    } = req.body;

    const [result] = await db.query(
      `UPDATE programs
       SET
       title=?,
       description=?,
       trainer_name=?,
       start_date=?,
       end_date=?,
       capacity=?,
       status=?
       WHERE id=?`,
      [
        title,
        description,
        trainer_name,
        start_date,
        end_date,
        capacity,
        status,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Program Not Found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Program Updated Successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// Delete Program
const deleteProgram = async (req, res) => {
  try {

    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM programs WHERE id=?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Program Not Found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Program Deleted Successfully"
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
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram
};