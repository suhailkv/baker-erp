const { Sequelize, DataTypes } = require('sequelize');

// --- Sequelize Init ---
const sequelize = new Sequelize(
  process.env.DB_NAME || 'erp',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    logging: true,
  }
);

const db = {};

// --- Load Models ---
db.User = require('./user')(sequelize, DataTypes);
db.Role = require('./role')(sequelize, DataTypes);
db.UserRole = require('./userRole')(sequelize, DataTypes);

db.RawMaterial = require('./rawMaterial')(sequelize, DataTypes);
db.Production = require('./production')(sequelize, DataTypes);
db.Sale = require('./sale')(sequelize, DataTypes);
db.ProductionRawMaterial = require('./productionRawMaterial')(sequelize, DataTypes);
db.Customer = require('./customer')(sequelize, DataTypes);
db.ExpenseCategory = require('./ExpenseCategory')(sequelize, DataTypes);
db.ExpenseNameMaster = require('./ExpenseNameMaster')(sequelize, DataTypes);

// --- Associations ---
Object.values(db)
  .filter((model) => typeof model.associate === 'function')
  .forEach((model) => model.associate(db));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
