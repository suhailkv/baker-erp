const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            email: {
                type: DataTypes.STRING(120),
                allowNull: false,
                unique: true,
                validate: { isEmail: true },
            },
            password_hash: { type: DataTypes.STRING, allowNull: false },
        },
        {
            tableName: 'users',
            underscored: true,
            defaultScope: { attributes: { exclude: ['password_hash'] } },
            scopes: { withSecret: { attributes: { include: ['password_hash'] } } },
        }
    );

    // Password check method
    User.prototype.checkPassword = function (plain) {
        return bcrypt.compare(plain, this.password_hash);
    };

    // Hooks for hashing password
    User.addHook('beforeCreate', async (user) => {
        if (user.password_hash) {
            user.password_hash = await bcrypt.hash(user.password_hash, 10);
        }
    });
    User.addHook('beforeUpdate', async (user) => {
        if (user.password_hash) {
            user.password_hash = await bcrypt.hash(user.password_hash, 10);
        }
    });

    // Associations
    User.associate = (models) => {
        User.belongsToMany(models.Role, { through: models.UserRole });
    };

    return User;
};
