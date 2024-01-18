const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { projectService } = require('../services');
const multer = require('multer');
const path = require('path');

const createProject = catchAsync(async (req, res) => {
  const project = await projectService.createProject(req.body);
  console.log(project);
  if (project.length > 0) {
    res.send({ lookup: 'Project created successfully', projectId: project[0] });
  } else {
    res.send({ error: project });
  }
});

const updateProject = catchAsync(async (req, res) => {
  const project = await projectService.updateProject(req.body);
  if (project == 'success') {
    res.send({ lookup: 'Project updated successfully' });
  } else {
    res.send({ error: project });
  }
});

const getProjectById = catchAsync(async (req, res) => {
  const project = await projectService.getProjectById(req.params.id);
  res.send({ project });
});

const searchProject = catchAsync(async (req, res) => {
  const project = await projectService.searchProject(req.body);
  res.send({ project });
});

const searchProjectAll = catchAsync(async (req, res) => {
  const project = await projectService.searchProjectAll(req.body);
  res.send({ project });
});

const prjectlistByManager = catchAsync(async (req, res) => {
  const project = await projectService.prjectlistByManager(req.body);
  res.send({ project });
});

const addTeamMember = catchAsync(async (req, res) => {
  const project = await projectService.addTeamMember(req.body);
  res.send({ project });
});

const createProjAttachment = catchAsync(async (req, res) => {
  const project = await projectService.createProjAttachment(req);
  if (project == 'success') {
    res.send({ lookup: 'Project attachment added successfully' });
  } else {
    res.send({ error: project });
  }
});

const updateProjAttachment = catchAsync(async (req, res) => {
  const project = await projectService.updateProjAttachment(req.body);
  if (project == 'success') {
    res.send({ lookup: 'Project attachment updated successfully' });
  } else {
    res.send({ error: project });
  }
});
const getAttachment = catchAsync(async (req, res) => {
  const project = await projectService.getAttachment(req.params.id);
  res.send({ project });
});

const teamMemberByProject = catchAsync(async (req, res) => {
  const project = await projectService.teamMemberByProject(req.params.id);
  res.send({ project });
});

const getProjectManager = catchAsync(async (req, res) => {
  const project = await projectService.getProjectManager(req.body);
  res.send({ project });
});

const createComposition = catchAsync(async (req, res) => {
  const project = await projectService.createComposition(req.body);
  if (project == 'success') {
    res.send({ lookup: 'Project composition added successfully' });
  } else {
    res.send({ error: project });
  }
});

const updateComposition = catchAsync(async (req, res) => {
  const project = await projectService.updateComposition(req.body);
  if (project == 'success') {
    res.send({ lookup: 'Project composition updated successfully' });
  } else {
    res.send({ error: project });
  }
});

const getComposition = catchAsync(async (req, res) => {
  const project = await projectService.getComposition(req.params.id);
  res.send({ project });
});

const deleteComposition = catchAsync(async (req, res) => {
  const project = await projectService.deleteComposition(req.params.id);
  if (project == 'success') {
    res.send({ lookup: 'Project composition deleted successfully' });
  } else {
    res.send({ error: project });
  }
});

const deleteComposition_ByID = catchAsync(async (req, res) => {
  const project = await projectService.deleteComposition_ByID(req.params.id);
  if (project == 'success') {
    res.send({ lookup: 'Project composition deleted successfully' });
  } else {
    res.send({ error: project });
  }
});

const createProjectWeek = catchAsync(async (req, res) => {
  const project = await projectService.createProjectWeek(req.body);
  if (project[0].LV_Id) {
    res.send({ lookup: 'Project week added successfully', weekId: project[0].LV_Id });
  } else {
    res.send({ error: project });
  }
});
const updateProjectWeek = catchAsync(async (req, res) => {
  const project = await projectService.updateProjectWeek(req.body);
  if (project[0].LV_Id) {
    res.send({ lookup: 'Project week updated successfully', weekId: project[0].LV_Id });
  } else {
    res.send({ error: project });
  }
});
const getProjectWeekById = catchAsync(async (req, res) => {
  const project = await projectService.getProjectWeekById(req.params.id);
  res.send({ project });
});

const getProjectWeekGetByProjectId = catchAsync(async (req, res) => {
  const project = await projectService.getProjectWeekGetByProjectId(req.body);
  res.send({ project });
});

const createProjectRaid = catchAsync(async (req, res) => {
  const project = await projectService.createProjectRaid(req.body);
  if (project == 'success') {
    res.send({ lookup: 'Project raid added successfully' });
  } else {
    res.send({ error: project });
  }
});

const updateProjectRaid = catchAsync(async (req, res) => {
  const project = await projectService.updateProjectRaid(req.body);
  if (project == 'success') {
    res.send({ lookup: 'Project raid updated successfully' });
  } else {
    res.send({ error: project });
  }
});

const getProjectRaidById = catchAsync(async (req, res) => {
  const project = await projectService.getProjectRaidById(req.params.pid);
  res.send({ project });
});

const deleteProjectRaid = catchAsync(async (req, res) => {
  const project = await projectService.deleteProjectRaid(req.params.id);
  if (project == 'success') {
    res.send({ lookup: 'Project RAID deleted successfully' });
  } else {
    res.send({ error: project });
  }
});

const getWsr = catchAsync(async (req, res) => {
  const project = await projectService.getWsr(req.body);
  res.send({ project });
});

const projectFlagApplay = catchAsync(async (req, res) => {
  const project = await projectService.projectFlagApplay(req.body);
  res.send({ project });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/Project/Flag');
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

const getProjectFlag = catchAsync(async (req, res) => {
  const project = await projectService.getProjectFlag(req.body);
  res.send({ project });
});

const deleteAttachment = catchAsync(async (req, res) => {
  const user = await projectService.deleteAttachment(req.params.id);
  if (user == 'success') {
    res.send({ lookup: 'Attachment deleted successfully' });
  } else {
    res.send({ error: user });
  }
});

const deleteTeamMember = catchAsync(async (req, res) => {
  const user = await projectService.deleteTeamMember(req.params.id);
  if (user == 'success') {
    res.send({ project: 'Team Member deleted successfully' });
  } else {
    res.send({ error: user });
  }
});

module.exports = {
  createProject,
  updateProject,
  getProjectById,
  searchProject,
  createProjAttachment,
  updateProjAttachment,
  getAttachment,
  teamMemberByProject,
  createComposition,
  updateComposition,
  getComposition,
  deleteComposition,
  createProjectWeek,
  updateProjectWeek,
  getProjectWeekById,
  createProjectRaid,
  updateProjectRaid,
  getProjectRaidById,
  deleteProjectRaid,
  searchProjectAll,
  prjectlistByManager,
  addTeamMember,
  getProjectWeekGetByProjectId,
  getWsr,
  getProjectManager,
  deleteComposition_ByID,
  getProjectFlag,
  projectFlagApplay,
  upload,
  deleteAttachment,
  deleteTeamMember,
};
