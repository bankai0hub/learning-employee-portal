require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Database Connection
require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const programRoutes = require("./routes/programRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Middleware
const authMiddleware = require("./middleware/authMiddleware");
const authorizeRoles = require("./middleware/roleMiddleware");

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("Learning Portal Backend Running...");
});

// ===========================
// API ROUTES
// ===========================

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/programs", programRoutes);

app.use("/api/registrations", registrationRoutes);

app.use("/api/attendance", attendanceRoutes);

app.use("/api/assessments", assessmentRoutes);

app.use("/api/feedback", feedbackRoutes);

app.use("/api/dashboard", dashboardRoutes);
// ===========================
// TEST PROTECTED ROUTES
// ===========================

app.get(
  "/api/profile",
  authMiddleware,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Profile Access Successful",
      user: req.user
    });
  }
);

app.get(
  "/api/admin",
  authMiddleware,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin"
    });
  }
);

app.get(
  "/api/employee",
  authMiddleware,
  authorizeRoles("EMPLOYEE"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Employee"
    });
  }
);

app.get(
  "/api/dashboard",
  authMiddleware,
  authorizeRoles("ADMIN", "EMPLOYEE"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Dashboard Access Granted"
    });
  }
);

// ===========================
// 404 ROUTE
// ===========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found"
  });
});

// ===========================
// SERVER
// ===========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});