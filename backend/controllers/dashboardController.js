const db = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {

    // Basic Counts
    const [[users]] = await db.query(
      "SELECT COUNT(*) AS totalUsers FROM users"
    );

    const [[programs]] = await db.query(
      "SELECT COUNT(*) AS totalPrograms FROM programs"
    );

    const [[registrations]] = await db.query(
      "SELECT COUNT(*) AS totalRegistrations FROM registrations"
    );

    const [[attendance]] = await db.query(
      "SELECT COUNT(*) AS totalAttendance FROM attendance"
    );

    const [[assessments]] = await db.query(
      "SELECT COUNT(*) AS totalAssessments FROM assessments"
    );

    const [[feedback]] = await db.query(
      "SELECT COUNT(*) AS totalFeedback FROM feedback"
    );

    // Pass / Fail Stats
    const [[passCount]] = await db.query(
      "SELECT COUNT(*) AS totalPass FROM assessments WHERE result='PASS'"
    );

    const [[failCount]] = await db.query(
      "SELECT COUNT(*) AS totalFail FROM assessments WHERE result='FAIL'"
    );

    const totalResults =
      passCount.totalPass + failCount.totalFail;

    const passPercentage =
      totalResults > 0
        ? ((passCount.totalPass / totalResults) * 100).toFixed(2)
        : 0;

    const failPercentage =
      totalResults > 0
        ? ((failCount.totalFail / totalResults) * 100).toFixed(2)
        : 0;

    // Feedback Ratings
    const [[ratings]] = await db.query(`
      SELECT
      AVG(quality_rating) AS avgQualityRating,
      AVG(trainer_rating) AS avgTrainerRating,
      AVG(relevance_rating) AS avgRelevanceRating
      FROM feedback
    `);

    res.status(200).json({
      success: true,

      totalUsers: users.totalUsers,
      totalPrograms: programs.totalPrograms,
      totalRegistrations: registrations.totalRegistrations,
      totalAttendance: attendance.totalAttendance,
      totalAssessments: assessments.totalAssessments,
      totalFeedback: feedback.totalFeedback,

      passPercentage,
      failPercentage,

      avgQualityRating:
        Number(ratings.avgQualityRating || 0).toFixed(2),

      avgTrainerRating:
        Number(ratings.avgTrainerRating || 0).toFixed(2),

      avgRelevanceRating:
        Number(ratings.avgRelevanceRating || 0).toFixed(2)
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
  getDashboardStats
};