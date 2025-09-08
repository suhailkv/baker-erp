module.exports = (sequelize,DataTypes) => {
    const RawMaterial = sequelize.define('RawMaterial', {
        id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        expense_name_id: { type: DataTypes.INTEGER, allowNull: false },
        unit: { type: DataTypes.STRING, allowNull: false },
        initial_stock: { type: DataTypes.INTEGER, defaultValue: 0 },  // initial stock
        current_stock: { type: DataTypes.INTEGER, defaultValue: 0 },  // auto-managed
        amount_spent: { type: DataTypes.FLOAT, defaultValue: 0 },     // calculated
        expense_type: { type: DataTypes.INTEGER, defaultValue: 1 }, // 1 for Raw Material, 2 for Expense
        spent_on: { type: DataTypes.DATE, defaultValue: null },
    }, {
        tableName: 'raw_materials',
        underscored: true,
    });
    const associate = (models) => {

        RawMaterial.belongsToMany(models.Production, {
            through: models.ProductionRawMaterial,
            foreignKey: 'id',
            otherKey: 'id',
        });
        RawMaterial.belongsTo(models.ExpenseNameMaster, { foreignKey: 'expense_name_id' });


    }
    RawMaterial.associate = associate;
    return RawMaterial;
};
