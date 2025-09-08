const { EntitySchema } = require('typeorm');

const ManagementTeam = new EntitySchema({
  name: 'ManagementTeam',
  tableName: 'management_team',
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
    position: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    bio: {
      type: 'text',
      nullable: true,
    },
    expertise: {
      type: 'text',
      nullable: true,
    },
    image: {
      type: 'text',
      nullable: true,
    },
    email: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    phone: {
      type: 'varchar',
      length: 50,
      nullable: true,
    },
    linkedinUrl: {
      type: 'varchar',
      length: 500,
      nullable: true,
    },
    order: {
      type: 'int',
      default: 0,
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

module.exports = ManagementTeam;
