module.exports = (sequelize, DataTypes) => {

    const ExpenseNameMaster = sequelize.define('ExpenseNameMaster', {
        expense_name_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: true,

        },
        expense_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'expense_name_master',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['category_id', 'expense_name'],
            },
        ],
    });
    const associate = (model) => {

        // model.ExpenseCategory.hasMany(ExpenseNameMaster, { foreignKey: 'category_id', });
        // ExpenseNameMaster.belongsTo(model.ExpenseCategory, { foreignKey: 'category_id', });
    }
    ExpenseNameMaster.associate = associate;
    return ExpenseNameMaster;
}