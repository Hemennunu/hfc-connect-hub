const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
// connectDB() will be called in server.js after AppDataSource.initialize()
const { initSocket } = require("./socket");
const staffRoutes = require("./routes/staff");

const app = express();
// connectDB() will be called in server.js after AppDataSource.initialize()

const allowedOrigins = ['http://localhost:8080', 'http://localhost:5173','http://localhost:5174']; // Add your allowed origins here
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

// Configure CORS middleware BEFORE defining routes
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Allow non-browser requests like Postman
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

app.use(express.json({ limit: '50mb' })); // JSON body parser with increased limit
app.use(express.urlencoded({ limit: '50mb', extended: true })); // URL-encoded parser with increased limit

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
app.use("/api/news", newsRoutes); // after CORS and json middleware
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
app.use("/api/thematic-areas", require("./routes/thematicArea"));
app.use("/api/mission-vision", require("./routes/missionVision"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/fix", require("./routes/fix-data"));
// ... other routes


