const { EntitySchema } = require('typeorm');

const GalleryItem = new EntitySchema({
  name: 'GalleryItem',
  tableName: 'gallery_items',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    title: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    description: {
      type: 'text',
      nullable: true,
    },
    mediaUrl: {
      type: 'text',
      nullable: false,
    },
    mediaType: {
      type: 'enum',
      enum: ['image', 'video'],
      default: 'image',
    },
    category: {
      type: 'enum',
      enum: ['events', 'projects', 'community', 'facilities', 'staff', 'beneficiaries'],
      nullable: false,
    },
    location: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    dateTaken: {
      type: 'date',
      nullable: true,
    },
    tags: {
      type: 'text',
      nullable: true,
    },
    featured: {
      type: 'boolean',
      default: false,
    },
    status: {
      type: 'enum',
      enum: ['draft', 'published', 'archived'],
      default: 'published',
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

module.exports = GalleryItem;
