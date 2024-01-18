const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { lookupService } = require('../services');

const getMetadata = catchAsync(async (req, res) => {
  const lookup = await lookupService.getMetadata(req.params.type, req.params.id);
  res.send({ lookup });
});

const getAllMetadata = catchAsync(async (req, res) => {
  const lookup = await lookupService.getAllMetadata();
  res.send({ lookup });
});

const addMetadata = catchAsync(async (req, res) => {
  const user = await lookupService.addMetadata(req.body);
  if (user == 'success') {
    res.send({ lookup: "Metadata added successfully" });
  } else {
    res.send({ error: user });
  }
  
});

const updateMetadata = catchAsync(async (req, res) => {
  const user = await lookupService.updateMetadata(req.body);
  if (user == 'success') {
    res.send({ lookup: "Metadata updated successfully" });
  } else {
    res.send({ error: user });
  }
});

const deleteMetadata = catchAsync(async (req, res) => {
  const user = await lookupService.deleteMetadata(req.params.type, req.params.id);
  if (user == 'success') {
    res.send({ lookup: "Metadata deleted successfully" });
  } else {
    res.send({ error: user });
  }
});

module.exports = {
  getMetadata, addMetadata, updateMetadata, deleteMetadata, getAllMetadata
};
