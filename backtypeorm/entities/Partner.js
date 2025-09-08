const { EntitySchema } = require('typeorm');

const Partner = new EntitySchema({
  name: 'Partner',
  tableName: 'partners',
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
    logoUrl: {
      type: 'text',
      nullable: true,
    },
    website: {
      type: 'varchar',
      length: 500,
      nullable: true,
    },
    description: {
      type: 'text',
      nullable: true,
    },
    partnershipType: {
      type: 'enum',
      enum: ['funding', 'implementation', 'strategic', 'technical', 'media'],
      default: 'strategic',
    },
    contactPerson: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    contactEmail: {
      type: 'varchar',
      length: 255,
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

module.exports = Partner;
