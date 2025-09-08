const { EntitySchema } = require('typeorm');

const User = new EntitySchema({
  name: 'User',
  tableName: 'users',
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
    password: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    role: {
      type: 'enum',
      enum: ['admin', 'user'],
      default: 'user',
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

module.exports = User;
