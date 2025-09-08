const { EntitySchema } = require('typeorm');

const Donation = new EntitySchema({
  name: 'Donation',
  tableName: 'donations',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    donorName: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    email: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    amount: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: false,
    },
    currency: {
      type: 'varchar',
      length: 10,
      default: 'USD',
    },
    message: {
      type: 'text',
      nullable: true,
    },
    isAnonymous: {
      type: 'boolean',
      default: false,
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

module.exports = Donation;
