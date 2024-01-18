const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { dashboardService, masterService } = require('../services');

const getAddProjectFilter = catchAsync(async (req, res) => {
  const client_res = await masterService.getClient();
  const cap_res = await masterService.getCapabilty();
  const delivery_res = await masterService.getDeliveryType();
  const engagement_res = await masterService.getEngagementType();
  const pstatus_res = await masterService.getProjectStatus();
  const tech_res = await masterService.getTeachStack();
  const industry = await masterService.getIndustry();
  const project_type = await masterService.getProjectType();
  const users = await masterService.searchUser();
  res.send({
    capability: cap_res,
    client: client_res,
    projectStatus: pstatus_res,
    deliveryType: delivery_res,
    engagementType: engagement_res,
    techStack: tech_res,
    industry: industry,
    project_type: project_type,
    users: users,
  });
});

module.exports = {
  getAddProjectFilter,
};
