const router = require("express").Router();
const multer = require("multer");
const { uploadPdf, getUpload } = require("../controllers/upload.controller");
const auth = require("../middlewares/auth.middleware");

const upload = multer({ dest: "uploads/pdfs/" });

router.post("/pdf", auth, upload.single("pdf"), uploadPdf);
router.get("/:id", auth, getUpload);

module.exports = router;
