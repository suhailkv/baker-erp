const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Import = sequelize.define(
    'Import',
    {
      importCode: { type: DataTypes.STRING, allowNull: false, unique: true },
      supplier: { type: DataTypes.STRING, allowNull: false },
      status: {
        type: DataTypes.ENUM('PENDING', 'RECEIVED', 'CANCELLED'),
        defaultValue: 'PENDING',
      },
      arrivalDate: { type: DataTypes.DATE },
    },
    {
      tableName: 'imports',
      underscored: true,
    }
  );

  return Import;
};
