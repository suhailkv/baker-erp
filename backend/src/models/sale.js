module.exports = (sequelize,DataTypes) => {
    const Sale = sequelize.define(
        'Sale',
        {
            order_code: { type: DataTypes.STRING, allowNull: false, unique: true },
            customer_id: { type: DataTypes.INTEGER, allowNull: false },
            amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
            quantity: { type: DataTypes.INTEGER, allowNull: false },
            production_id: { type: DataTypes.INTEGER, allowNull: false },
            status: {
                type: DataTypes.ENUM('PENDING', 'PAID', 'CANCELLED'),
                defaultValue: 'PENDING',
            },
        },
        {
            tableName: 'sales',
            underscored: true,
        }
    );
    const associate = (models) => {
        Sale.belongsTo(models.Customer, { foreignKey: 'customer_id' });
        Sale.belongsTo(models.Production, { foreignKey: 'production_id' });

    }
    Sale.associate = associate;
    return Sale;
};
