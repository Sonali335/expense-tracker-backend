const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const { getExpenses } = require("../controllers/expense.controller");

router.get("/", auth, getExpenses);
module.exports = router;
