const { EntitySchema } = require('typeorm');

const BoardMember = new EntitySchema({
  name: 'BoardMember',
  tableName: 'board_members',
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
    role: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    education: {
      type: 'text',
      nullable: true,
    },
    bio: {
      type: 'text',
      nullable: true,
    },
    profileImage: {
      type: 'text',
      nullable: true,
    },
    linkedinProfile: {
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

module.exports = BoardMember;
