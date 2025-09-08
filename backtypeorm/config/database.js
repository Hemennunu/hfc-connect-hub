const { DataSource } = require('typeorm');
require('dotenv').config();

// Import all entities
const Staff = require('../entities/Staff');
const Alumni = require('../entities/Alumni');
const BoardDirector = require('../entities/BoardDirector');
const BoardMember = require('../entities/BoardMember');
const CaseStory = require('../entities/CaseStory');
const Contact = require('../entities/Contact');
const Donation = require('../entities/Donation');
const FounderProfile = require('../entities/FounderProfile');
const GalleryItem = require('../entities/GalleryItem');
const ManagementTeam = require('../entities/ManagementTeam');
const MissionVision = require('../entities/MissionVision');
const News = require('../entities/News');
const OrganizationalProfile = require('../entities/OrganizationalProfile');
const Partner = require('../entities/Partner');
const Project = require('../entities/Project');
const Report = require('../entities/Report');
const Stats = require('../entities/Stats');
const ThematicArea = require('../entities/ThematicArea');
const User = require('../entities/User');

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hfc_database',
  synchronize: process.env.NODE_ENV !== 'production', // Auto-sync in development
  logging: process.env.NODE_ENV === 'development',
  entities: [
    Staff,
    Alumni,
    BoardDirector,
    BoardMember,
    CaseStory,
    Contact,
    Donation,
    FounderProfile,
    GalleryItem,
    ManagementTeam,
    MissionVision,
    News,
    OrganizationalProfile,
    Partner,
    Project,
    Report,
    Stats,
    ThematicArea,
    User
  ],
  migrations: ['src/migrations/*.js'],
  subscribers: ['src/subscribers/*.js'],
});

module.exports = AppDataSource;
