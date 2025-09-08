module.exports = (sequelize, DataTypes) => {
    const UserRole = sequelize.define(
        'UserRole',
        {},
        { tableName: 'user_roles', underscored: true }
    );
    return UserRole;
};
