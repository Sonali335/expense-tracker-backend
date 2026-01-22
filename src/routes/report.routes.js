const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const { getReports } = require("../controllers/report.controller");

router.get("/", auth, getReports);
module.exports = router;
