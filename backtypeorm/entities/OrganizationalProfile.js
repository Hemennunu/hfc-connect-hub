const { EntitySchema } = require('typeorm');

const OrganizationalProfile = new EntitySchema({
  name: 'OrganizationalProfile',
  tableName: 'organizational_profiles',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    history: {
      type: 'text',
      nullable: false,
    },
    objectives: {
      type: 'text',
      nullable: false,
    },
    coreValues: {
      type: 'text',
      nullable: false,
    },
    mission: {
      type: 'text',
      nullable: false,
    },
    vision: {
      type: 'text',
      nullable: false,
    },
    logoUrl: {
      type: 'text',
      nullable: true,
    },
    brandColors: {
      type: 'json',
      nullable: true,
    },
    establishedYear: {
      type: 'int',
      nullable: true,
    },
    registrationNumber: {
      type: 'varchar',
      length: 255,
      nullable: true,
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

module.exports = OrganizationalProfile;
