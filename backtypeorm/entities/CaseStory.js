const { EntitySchema } = require('typeorm');

const CaseStory = new EntitySchema({
  name: 'CaseStory',
  tableName: 'case_stories',
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
    content: {
      type: 'text',
      nullable: false,
    },
    summary: {
      type: 'text',
      nullable: true,
    },
    beneficiaryName: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    age: {
      type: 'int',
      nullable: true,
    },
    location: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    category: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    mediaUrl: {
      type: 'text',
      nullable: true,
    },
    mediaType: {
      type: 'enum',
      enum: ['image', 'video', 'text', 'photo', 'audio', 'photo_essay'],
      default: 'text',
    },
    impact: {
      type: 'text',
      nullable: true,
    },
    outcome: {
      type: 'text',
      nullable: true,
    },
    publishDate: {
      type: 'date',
      nullable: true,
    },
    dateRecorded: {
      type: 'date',
      nullable: true,
    },
    tags: {
      type: 'json',
      nullable: true,
    },
    featured: {
      type: 'boolean',
      default: false,
    },
    status: {
      type: 'enum',
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
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

module.exports = CaseStory;
