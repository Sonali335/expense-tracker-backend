exports.uploadPdf = (req, res) => {
  res.json({
    uploadId: 123,
    message: "PDF uploaded successfully"
  });
};

exports.getUpload = (req, res) => {
  res.json({
    uploadId: req.params.id,
    expenses: []
  });
};
