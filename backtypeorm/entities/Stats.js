const { EntitySchema } = require('typeorm');

const Stats = new EntitySchema({
  name: 'Stats',
  tableName: 'stats',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    number: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    label: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    icon: {
      type: 'varchar',
      length: 100,
      nullable: false,
      default: 'circle',
    },
    color: {
      type: 'enum',
      enum: ['blue', 'green', 'orange', 'purple'],
      nullable: false,
      default: 'blue',
    },
    order: {
      type: 'int',
      nullable: false,
      default: 0,
    },
    secondaryNumber: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    secondaryLabel: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    additionalNumbers: {
      type: 'json',
      nullable: true,
    },
    additionalLabel: {
      type: 'varchar',
      length: 255,
      nullable: true,
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
  indices: [
    {
      name: 'IDX_STATS_ORDER_ACTIVE',
      columns: ['order', 'isActive'],
      unique: true,
      where: 'isActive = 1',
    },
  ],
});

module.exports = Stats;
