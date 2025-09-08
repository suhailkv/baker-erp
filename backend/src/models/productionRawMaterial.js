const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ProductionRawMaterial = sequelize.define(
        'ProductionRawMaterial',
        {
            id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            usedQty: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
            production_id: { type: DataTypes.INTEGER, },
            raw_material_id: { type: DataTypes.INTEGER,},
        },
        {
            tableName: 'production_raw_materials',
            underscored: true,
            timestamps: false,
        }
    );
    const associate = (models) => {
        ProductionRawMaterial.belongsTo(models.Production, { foreignKey: 'production_id' });
        ProductionRawMaterial.belongsTo(models.RawMaterial, { foreignKey: 'raw_material_id' });
    }
    ProductionRawMaterial.associate = associate;

    return ProductionRawMaterial;
};
