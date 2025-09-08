const { EntitySchema } = require('typeorm');

const BoardDirector = new EntitySchema({
  name: 'BoardDirector',
  tableName: 'board_directors',
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
    role: {
      type: 'varchar',
      length: 255,
      nullable: true,
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
    profileImage: {
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
    linkedin: {
      type: 'varchar',
      length: 500,
      nullable: true,
    },
    isActive: {
      type: 'boolean',
      default: true,
    },
    order: {
      type: 'int',
      default: 0,
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

module.exports = BoardDirector;
