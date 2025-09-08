const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Export = sequelize.define(
    'Export',
    {
      exportCode: { type: DataTypes.STRING, allowNull: false, unique: true },
      destinationCountry: { type: DataTypes.STRING, allowNull: false },
      carrier: { type: DataTypes.STRING },
      status: {
        type: DataTypes.ENUM('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
        defaultValue: 'PENDING',
      },
      shipmentDate: { type: DataTypes.DATE },
    },
    {
      tableName: 'exports',
      underscored: true,
    }
  );

  return Export;
};
