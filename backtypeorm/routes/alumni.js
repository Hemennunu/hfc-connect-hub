const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const AppDataSource = require("../config/database");
const Alumni = require("../entities/Alumni");
const { auth, adminOnly } = require("../middleware/auth");

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '../uploads/alumni');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/alumni/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "alumni-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
    fieldSize: 1024 * 1024, // 1MB field size limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Get public alumni profiles (for frontend display)
router.get("/public", async (req, res) => {
  try {
    const alumniRepository = AppDataSource.getRepository(Alumni);
    const alumni = await alumniRepository.find({
      where: {
        consented: true,
        isPublic: true,
      },
      order: { graduationYear: "DESC" },
    });
    res.json(alumni);
  } catch (error) {
    console.error("Error fetching public alumni:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all alumni (admin only - for management)
router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const alumniRepository = AppDataSource.getRepository(Alumni);
    const alumni = await alumniRepository.find({
      order: { createdAt: "DESC" },
    });
    res.json(alumni);
  } catch (error) {
    console.error("Error fetching all alumni:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single alumni by ID
router.get("/:id", auth, adminOnly, async (req, res) => {
  try {
    const alumniRepository = AppDataSource.getRepository(Alumni);
    const alumni = await alumniRepository.findOne({
      where: { id: req.params.id },
    });

    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    res.json(alumni);
  } catch (error) {
    console.error("Error fetching alumni:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Alumni registration form (public) - DISABLED
router.post("/register", (req, res) => {
  res.status(403).json({
    message:
      "Public registration is disabled. Alumni profiles are managed through the admin panel.",
  });
});

// Create new alumni (admin only)
router.post(
  "/",
  auth,
  adminOnly,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      if (!AppDataSource.isInitialized) {
        return res.status(503).json({ message: "Database not connected" });
      }

      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Handle multipart/form-data
      if (req.headers['content-type']?.includes('multipart/form-data') && !req.body) {
        return res.status(400).json({ message: "Invalid form data" });
      }
      
      const alumniRepository = AppDataSource.getRepository(Alumni);

      // Check if email already exists
      const existingAlumni = await alumniRepository.findOne({
        where: { email: req.body.email },
      });

      if (existingAlumni) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Validate required fields
      const { name, email, graduationYear, currentOccupation } = req.body;
      if (!name || !email || !graduationYear || !currentOccupation) {
        return res.status(400).json({
          message:
            "name, email, graduation year, and current occupation are required",
        });
      }

      let achievements = [];
      if (req.body.achievements) {
        try {
          achievements = JSON.parse(req.body.achievements);
        } catch (error) {
          return res.status(400).json({ message: "Invalid achievements format. Expected a JSON array." });
        }
      }

      const alumniData = {
        ...req.body,
        achievements,
        profileImage: req.file ? req.file.filename : null,
        consented: req.body.consented === 'true',
        isPublic: req.body.isPublic === 'true',
        mentorshipAvailable: req.body.mentorshipAvailable === 'true',
        createdByAdmin: true,
      };

      const newAlumni = alumniRepository.create(alumniData);
      const savedAlumni = await alumniRepository.save(newAlumni);

      // Emit real-time update
      if (req.io) {
        req.io.emit("alumniCreated", savedAlumni);
      }

      res.status(201).json(savedAlumni);
    } catch (error) {
      console.error("Error creating alumni:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Update alumni (admin only)
router.put(
  "/:id",
  auth,
  adminOnly,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      if (!AppDataSource.isInitialized) {
        return res.status(503).json({ message: "Database not connected" });
      }

      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const alumniId = parseInt(req.params.id);

      if (isNaN(alumniId)) {
        return res.status(400).json({ message: "Invalid alumni ID" });
      }

      const alumniRepository = AppDataSource.getRepository(Alumni);

      const alumni = await alumniRepository.findOne({
        where: { id: alumniId },
      });
      if (!alumni) {
        return res.status(404).json({ message: "Alumni not found" });
      }

      // Check if email is being changed and if it already exists
      if (req.body.email && req.body.email !== alumni.email) {
        const existingAlumni = await alumniRepository.findOne({
          where: { email: req.body.email },
        });

        if (existingAlumni) {
          return res
            .status(400)
            .json({ message: "Alumni with this email already exists" });
        }
      }

      const updateData = { ...req.body };
      delete updateData.id;
      delete updateData.createdAt;
      delete updateData.updatedAt;
      delete updateData.createdByAdmin;

      if (req.body.achievements) {
        try {
          updateData.achievements = JSON.parse(req.body.achievements);
        } catch (error) {
          return res.status(400).json({ message: "Invalid achievements format. Expected a JSON array." });
        }
      }

      if (req.body.consented !== undefined) {
        updateData.consented = req.body.consented === 'true';
      }
      if (req.body.isPublic !== undefined) {
        updateData.isPublic = req.body.isPublic === 'true';
      }
      if (req.body.mentorshipAvailable !== undefined) {
        updateData.mentorshipAvailable = req.body.mentorshipAvailable === 'true';
      }

      if (req.file) {
        updateData.profileImage = req.file.filename;
      }

      await alumniRepository.update(alumniId, updateData);
      const updatedAlumni = await alumniRepository.findOne({
        where: { id: alumniId },
      });

      // Emit real-time update
      if (req.io) {
        req.io.emit("alumniUpdated", updatedAlumni);
      }

      res.json(updatedAlumni);
    } catch (error) {
      console.error("Error updating alumni:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Delete alumni (admin only)
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      return res.status(503).json({ message: "Database not connected" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const alumniId = parseInt(req.params.id);

    if (isNaN(alumniId)) {
      return res.status(400).json({ message: "Invalid alumni ID" });
    }

    const alumniRepository = AppDataSource.getRepository(Alumni);

    const alumni = await alumniRepository.findOne({ where: { id: alumniId } });
    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    await alumniRepository.delete(alumniId);

    // Emit real-time update
    if (req.io) {
      req.io.emit("alumniDeleted", alumniId);
    }

    res.json({ message: "Alumni deleted successfully" });
  } catch (error) {
    console.error("Error deleting alumni:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Approve consent and make public (admin only)
router.patch("/:id/approve", auth, adminOnly, async (req, res) => {
  try {
    const alumniRepository = AppDataSource.getRepository(Alumni);

    const alumni = await alumniRepository.findOne({
      where: { id: req.params.id },
    });
    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    await alumniRepository.update(req.params.id, {
      consented: true,
      isPublic: true,
    });
    const updatedAlumni = await alumniRepository.findOne({
      where: { id: req.params.id },
    });

    // Emit real-time update
    if (req.io) {
      req.io.emit("alumniApproved", updatedAlumni);
    }

    res.json({
      message: "Alumni profile approved and made public",
      alumni: updatedAlumni,
    });
  } catch (error) {
    console.error("Error approving alumni:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Search alumni (admin only)
router.get("/search/:query", auth, adminOnly, async (req, res) => {
  try {
    const query = req.params.query;
    const alumniRepository = AppDataSource.getRepository(Alumni);

    const alumni = await alumniRepository
      .createQueryBuilder("alumni")
      .where("alumni.name LIKE :query", { query: `%${query}%` })
      .orWhere("alumni.currentOccupation LIKE :query", { query: `%${query}%` })
      .orWhere("alumni.company LIKE :query", { query: `%${query}%` })
      .orWhere("alumni.location LIKE :query", { query: `%${query}%` })
      .getMany();

    res.json(alumni);
  } catch (error) {
    console.error("Error searching alumni:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
