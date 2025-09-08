const { EntitySchema } = require('typeorm');

const FounderProfile = new EntitySchema({
  name: 'FounderProfile',
  tableName: 'founder_profiles',
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
    bio: {
      type: 'text',
      nullable: true,
    },
    photoUrl: {
      type: 'text',
      nullable: true,
    },
    position: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    achievements: {
      type: 'text',
      nullable: true,
    },
    socialLinks: {
      type: 'json',
      nullable: true,
    },
    isActive: {
      type: 'boolean',
      default: true,
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
});

module.exports = FounderProfile;
