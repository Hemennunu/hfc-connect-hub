const { EntitySchema } = require('typeorm');

const ThematicArea = new EntitySchema({
  name: 'ThematicArea',
  tableName: 'thematic_areas',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    category: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    description: {
      type: 'text',
      nullable: true,
    },
    icon: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    color: {
      type: 'varchar',
      length: 50,
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

module.exports = ThematicArea;
