const { EntitySchema } = require('typeorm');

const MissionVision = new EntitySchema({
  name: 'MissionVision',
  tableName: 'mission_vision',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    mission: {
      type: 'text',
      nullable: true,
    },
    vision: {
      type: 'text',
      nullable: true,
    },
    values: {
      type: 'text',
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

module.exports = MissionVision;
