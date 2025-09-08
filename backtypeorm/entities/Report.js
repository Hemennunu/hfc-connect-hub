const { EntitySchema } = require('typeorm');

const Report = new EntitySchema({
  name: 'Report',
  tableName: 'reports',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    title: {
      type: 'varchar',
      length: 500,
      nullable: false,
    },
    description: {
      type: 'text',
      nullable: false,
    },
    type: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    fileUrl: {
      type: 'text',
      nullable: true,
    },
    fileName: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    fileSize: {
      type: 'int',
      nullable: true,
    },
    uploadDate: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    year: {
      type: 'int',
      nullable: true,
    },
    featured: {
      type: 'boolean',
      default: false,
    },
    downloadCount: {
      type: 'int',
      default: 0,
    },
    createdBy: {
      type: 'int',
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
  relations: {
    creator: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: { name: 'createdBy' },
      nullable: true,
    },
  },
});

module.exports = Report;
