const { EntitySchema } = require('typeorm');

const Staff = new EntitySchema({
  name: 'Staff',
  tableName: 'staff',
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
    department: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    location: {
      type: 'varchar',
      length: 255,
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
    status: {
      type: 'enum',
      enum: ['current', 'former'],
      default: 'current',
    },
    yearOfService: {
      type: 'varchar',
      length: 100,
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

module.exports = Staff;
