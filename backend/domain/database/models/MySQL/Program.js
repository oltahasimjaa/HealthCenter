const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/database');

const Program = sequelize.define('Program', {
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
     validate: {
      len: [1, 255] // Validate length
    }
  },
  description: {
    type: DataTypes.TEXT(1000),
    allowNull: true,
  },
  createdById: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',  
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
});



module.exports = Program;