const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { vxarticalService, kmarticalService } = require('../services');

const addVXArtical = catchAsync(async (req, res) => {
  const kmartical = await vxarticalService.addVXArtical(req.body);
  res.send(kmartical);
});

const getSourceTitle = catchAsync(async (req, res) => {
  const kmartical = await vxarticalService.getSourceTitle(req.params.id);
  res.send(kmartical);
});

const articlegeybyid = catchAsync(async (req, res) => {
  const kmartical = await vxarticalService.articlegeybyid(req.body);
  const filePath = await kmarticalService.getArticleAttachement(req.body);
  if (kmartical[0]) {
    if (filePath.length > 0) kmartical[0].FilePath = filePath;
    else kmartical[0].FilePath = [];
  }
  // console.log(kmartical);
  res.send(kmartical);
});

module.exports = {
  addVXArtical,
  getSourceTitle,
  articlegeybyid,
};
