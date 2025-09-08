module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define('Customer', {
        name: { type: DataTypes.STRING, allowNull: false },
        phone: { type: DataTypes.STRING, allowNull: false, unique: true },
    }, {
        tableName: 'customers',
        underscored: true,
    });
    const associate = (models) => {
        Customer.hasMany(models.Sale, { foreignKey: 'customer_id' });
    }
    Customer.associate = associate;
    return Customer;
};
