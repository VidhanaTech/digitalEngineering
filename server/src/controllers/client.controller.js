const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { clientService } = require('../services');
const multer = require('multer');
const path = require('path');

const getClientById = catchAsync(async (req, res) => {
  const client = await clientService.getClientById(req.params.id);
  res.send({ client });
});

const getClientsSearch = catchAsync(async (req, res) => {
  const client = await clientService.getClients(req.body);
  res.send({ client });
});

const addClient = catchAsync(async (req, res) => {
  const client = await clientService.addClient(req.body);
  res.send({ client });
});

const clientLocationApply = catchAsync(async (req, res) => {
  const client = await clientService.clientLocationApply(req.body);
  res.send({ client });
});

const getClientLocation = catchAsync(async (req, res) => {
  const client = await clientService.getClientLocation(req.body);
  res.send({ client });
});

const updateClient = catchAsync(async (req, res) => {
  const client = await clientService.updateClient(req.body);
  if (client == 'success') {
    res.send({ client: 'Client updated successfully' });
  } else {
    res.send({ error: client });
  }
});

const deleteClientLocation = catchAsync(async (req, res) => {
  const client = await clientService.deleteClientLocation(req.body);
  if (client == 'success') {
    res.send({ client: 'Client Location successfully' });
  } else {
    res.send({ error: client });
  }
});

const addAttachment = catchAsync(async (req, res) => {
  const client = await clientService.addAttachment(req);
  res.send({ client });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/client');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: '1000000' },
  fileFilter: (req, file, cb) => {
    // const fileTypes = /jpeg|jpg|png|gif|PNG|JPEG|JPG|GIF|Jpeg|Jpg|Png|Gif/;
    // const mimeType = fileTypes.test(file.mimetype);
    // const extname = fileTypes.test(path.extname(file.originalname));
    // if (mimeType && extname) {
    return cb(null, true);
    // }
    // cb('Give proper files formate to upload');
  },
}).single('image');

const getAttachment = catchAsync(async (req, res) => {
  const client = await clientService.getAttachment(req.params.id);
  res.send({ client });
});

const updateAttachment = catchAsync(async (req, res) => {
  const client = await clientService.updateAttachment(req.body);
  res.send({ client });
});

const getEngagement = catchAsync(async (req, res) => {
  const client = await clientService.getEngagement(req.params.id);
  res.send({ client });
});

const addEngagement = catchAsync(async (req, res) => {
  const client = await clientService.addEngagement(req.body);
  if (client == 'success') {
    res.send({ engagement: 'Engagement added successfully' });
  } else {
    res.send({ error: client });
  }
});

const updateEngagement = catchAsync(async (req, res) => {
  const client = await clientService.updateEngagement(req.body);
  if (client == 'success') {
    res.send({ engagement: 'Engagement updated successfully' });
  } else {
    res.send({ error: client });
  }
});

const deleteAttachment = catchAsync(async (req, res) => {
  const user = await clientService.deleteAttachment(req.params.id);
  if (user == 'success') {
    res.send({ lookup: 'Attachment deleted successfully' });
  } else {
    res.send({ error: user });
  }
});

module.exports = {
  getClientById,
  getClientsSearch,
  addClient,
  updateClient,
  addAttachment,
  getAttachment,
  updateAttachment,
  getClientLocation,
  clientLocationApply,
  getEngagement,
  addEngagement,
  updateEngagement,
  upload,
  deleteAttachment,
  deleteClientLocation,
};
