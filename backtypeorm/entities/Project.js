const { EntitySchema } = require('typeorm');

const Project = new EntitySchema({
  name: 'Project',
  tableName: 'projects',
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
    location: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    startDate: {
      type: 'date',
      nullable: true,
    },
    endDate: {
      type: 'date',
      nullable: true,
    },
    completedDate: {
      type: 'date',
      nullable: true,
    },
    beneficiaries: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    budget: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    fundingSource: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    impact: {
      type: 'text',
      nullable: true,
    },
    objectives: {
      type: 'text',
      nullable: true,
    },
    challenges: {
      type: 'text',
      nullable: true,
    },
    lessons: {
      type: 'text',
      nullable: true,
    },
    status: {
      type: 'enum',
      enum: ['planning', 'ongoing', 'completed', 'suspended', 'cancelled'],
      default: 'planning',
    },
    category: {
      type: 'enum',
      enum: [
        'Child Development',
        'Economic Development', 
        'Education',
        'Community Empowerment',
        'Governance',
        'Healthcare',
        'Community Development'
      ],
      nullable: false,
    },
    priority: {
      type: 'enum',
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
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

module.exports = Project;
