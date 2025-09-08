// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { sequelize, Role, User } = require('./src/models');
const authRoutes = require('./src/routes/auth.routes');
const reportRoutes = require('./src/routes/report.routes');
const rawMaterialRoutes = require('./src/routes/raw-material.routes');
const productionRoutes = require('./src/routes/production.routes');
const saleRoutes = require('./src/routes/sale.routes');
const customerRoutes = require('./src/routes/customer.routes');
const generalRoutes = require('./src/routes/general.route');
const swagger = require('./src/swagger');

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// health
app.get('/health', (req, res) => res.json({ ok: true }));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/raw-materials', rawMaterialRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/productions', productionRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/reports', require('./src/routes/reports.routes'));
app.use('/api/general', generalRoutes);
// swagger
swagger(app);

// db init + seed minimal roles/admin
async function init() {
  await sequelize.sync();
  const roleNames = ['ADMIN', 'INVENTORY', 'PRODUCTION', 'SALES'];
  const roles = await Promise.all(roleNames.map(name => Role.findOrCreate({ where: { name }, defaults: { name } })));
  let admin = await User.findOne({ where: { email: 'admin@erp.local' } });
  if (!admin) {
    admin = await User.create({ email: 'admin@erp.local', password_hash: 'admin123'});
    await admin.setRoles(await Role.findAll({ where: { name: ['ADMIN'] } }));
  }
}
init().catch(console.error);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
