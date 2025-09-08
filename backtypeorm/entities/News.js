const { EntitySchema } = require('typeorm');

const News = new EntitySchema({
  name: 'News',
  tableName: 'news',
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
    type: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    content: {
      type: 'text',
      nullable: false,
    },
    date: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    eventDate: {
      type: 'datetime',
      nullable: true,
    },
    location: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    mediaUrl: {
      type: 'text',
      nullable: true,
    },
    featured: {
      type: 'boolean',
      default: false,
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

module.exports = News;
