const { EntitySchema } = require('typeorm');

const Alumni = new EntitySchema({
  name: 'Alumni',
  tableName: 'alumni',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    name: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    email: {
      type: 'varchar',
      length: 255,
      nullable: false,
      unique: true,
    },
    phone: {
      type: 'varchar',
      length: 50,
      nullable: true,
    },
    profileImage: {
      type: 'text',
      nullable: true,
    },
    currentOccupation: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    company: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    location: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    yearsInProgram: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    graduationYear: {
      type: 'int',
      nullable: false,
    },
    successStory: {
      type: 'text',
      nullable: false,
    },
    achievements: {
      type: 'json',
      nullable: true,
    },
    linkedinProfile: {
      type: 'varchar',
      length: 500,
      nullable: true,
    },
    websiteUrl: {
      type: 'varchar',
      length: 500,
      nullable: true,
    },
    consented: {
      type: 'boolean',
      default: false,
      nullable: false,
    },
    isPublic: {
      type: 'boolean',
      default: false,
    },
    testimonial: {
      type: 'text',
      nullable: true,
    },
    impactStatement: {
      type: 'text',
      nullable: true,
    },
    mentorshipAvailable: {
      type: 'boolean',
      default: false,
    },
    createdByAdmin: {
      type: 'boolean',
      default: false,
    },
    createdAt: {
      type: 'timestamp',
      createDate: true,
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true,
    },
  },
  indices: [
    {
      name: 'IDX_ALUMNI_SEARCH',
      columns: ['name', 'currentOccupation', 'company'],
    },
  ],
});

module.exports = Alumni;
