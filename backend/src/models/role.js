module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define(
        'Role',
        { name: { type: DataTypes.STRING(40), allowNull: false, unique: true } },
        { tableName: 'roles', underscored: true }
    );

    Role.associate = (models) => {
        Role.belongsToMany(models.User, { through: models.UserRole });
    };

    return Role;
};
