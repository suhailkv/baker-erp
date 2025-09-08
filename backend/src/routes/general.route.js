const cntl = require("../controllers/general.controller");
const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");

router.get("/expense-names", requireAuth, cntl.listExpenseNames);
router.post("/expense-names", requireAuth, cntl.addExpenseName);
module.exports = router;
