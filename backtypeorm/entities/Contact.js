const { EntitySchema } = require('typeorm');

const Contact = new EntitySchema({
  name: 'Contact',
  tableName: 'contacts',
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
    },
    subject: {
      type: 'varchar',
      length: 500,
      nullable: false,
    },
    message: {
      type: 'text',
      nullable: false,
    },
    isRead: {
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

module.exports = Contact;
