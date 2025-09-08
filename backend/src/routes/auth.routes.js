// src/routes/auth.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

router.post('/login', ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);

// example: use this to test protected endpoints
router.get('/me', requireAuth, ctrl.me);

module.exports = router;
