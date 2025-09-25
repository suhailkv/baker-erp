const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Production = sequelize.define(
        'Production',
        {
            batch_code: { type: DataTypes.STRING, allowNull: false, unique: true },
            product_id : { type: DataTypes.INTEGER, allowNull: false },
            quantity: { type: DataTypes.INTEGER, allowNull: false },
            unit: { type: DataTypes.STRING, defaultValue: 'kg' },
            stock: { type: DataTypes.INTEGER, defaultValue: 0 },
            status: {
                type: DataTypes.ENUM('ONGOING', 'COMPLETED', 'CANCELLED'),
                defaultValue: 'ONGOING',
            },
        },
        {
            tableName: 'productions',
            underscored: true,
        }
    );
    const associate = (models) => {
        // Production.belongsToMany(models.RawMaterial, {
        //     through: models.ProductionRawMaterial,
        //     foreignKey: 'raw_material_id',
        //     otherKey: 'production_id',
        // });
        Production.hasMany(models.ProductionRawMaterial, { foreignKey: 'raw_material_id' });
        Production.hasMany(models.Sale, { foreignKey: 'production_id' });
        Production.belongsTo(models.ExpenseNameMaster, { foreignKey: 'product_id' });

    }
    Production.associate = associate;
    return Production;
};
