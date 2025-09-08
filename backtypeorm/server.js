const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
const AppDataSource = require("./config/database");
const { initSocket } = require("./socket");

const app = express();

const allowedOrigins = ['http://localhost:8080', 'http://localhost:5173','http://localhost:5174'];
const newsRoutes = require('./routes/news');
const galleryRoutes = require('./routes/gallery');
const reportRoutes = require('./routes/report');
const caseStoryRoutes = require('./routes/caseStory');
const alumniRoutes = require('./routes/alumni');
const projectRoutes = require('./routes/project');
const boardDirectorRoutes = require('./routes/boardDirector');
const boardMemberRoutes = require('./routes/boardMember');
const managementTeamRoutes = require('./routes/managementTeam');
const statsRoutes = require('./routes/stats');
const partnerRoutes = require('./routes/partner');
const contactRoutes = require('./routes/contactInfo');
const donationRoutes = require('./routes/donation');
const foundersRoutes = require('./routes/founders');
const orgProfileRoutes = require('./routes/orgProfile');
const missionVisionRoutes = require('./routes/missionVision');
const thematicAreaRoutes = require('./routes/thematicArea');
const staffRoutes = require("./routes/staff");

// Configure CORS middleware BEFORE defining routes
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

const server = http.createServer(app);

// Initialize Socket.IO with HTTP server
initSocket(server);

// Socket.IO middleware for routes
app.use((req, res, next) => {
  req.io = require('./socket').getIo();
  next();
});

// Mount routes
app.use("/api/news", newsRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/case-stories", caseStoryRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/board-directors", boardDirectorRoutes);
app.use("/api/board-members", boardMemberRoutes);
app.use("/api/management-team", managementTeamRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/founders", foundersRoutes);
app.use("/api/org-profile", orgProfileRoutes);
app.use("/api/mission-vision", missionVisionRoutes);
app.use("/api/thematic-areas", thematicAreaRoutes);
app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;

// Add error handling for the server
server.on('error', (error) => {
  console.error('Server error:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the server with TypeORM initialization
const startServer = async () => {
  try {
    console.log("Attempting to connect to database...");
    console.log("Database config:", {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      database: process.env.DB_NAME
    });
    
    await AppDataSource.initialize();
    console.log("Database connection established successfully");
    
    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
      console.log(`Backend API available at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    console.error("Error details:", error.message);
    
    // Try to start server without database for debugging
    console.log("Starting server without database connection for debugging...");
    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT} (WITHOUT DATABASE)`);
      console.log(`Backend API available at: http://localhost:${PORT}`);
    });
  }
};

startServer();