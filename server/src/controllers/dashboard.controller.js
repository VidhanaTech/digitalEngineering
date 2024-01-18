const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { dashboardService } = require('../services');

const index = catchAsync(async (req, res) => {
  const result = await dashboardService.getProjectList(req.body);
  const ms_count = await dashboardService.getEngagementCount(req.body, '1');
  const mc_count = await dashboardService.getEngagementCount(req.body, '2');
  const red_flag = await dashboardService.getFlagCount(req.body, '1');
  const blue_flag = await dashboardService.getFlagCount(req.body, '2');
  const openrisk = await dashboardService.getRiskIssue(req.body, '1');
  const openissue = await dashboardService.getRiskIssue(req.body, '3');
  const articleCount = await dashboardService.getCountbyArticleType(req.body, '1');
  const caseStudyCount = await dashboardService.getCountbyArticleType(req.body, '2');
  const knowledgeCount = await dashboardService.getCountbyArticleType(req.body, '3');
  let data = {
    result: result,
    ms_count: ms_count,
    mc_count: mc_count,
    red_flag: red_flag[0].cnt,
    blue_flag: blue_flag[0].cnt,
    openrisk: openrisk[0].cnt,
    openissue: openissue[0].cnt,
    articleCount: articleCount[0].cnt,
    caseStudyCount: caseStudyCount[0].cnt,
    knowledgeCount: knowledgeCount[0].cnt,
  };
  res.send(data);
});

const getfilter = catchAsync(async (req, res) => {
  const org_res = await dashboardService.getOrganization();
  const country_res = await dashboardService.getCountry();
  const cap_res = await dashboardService.getCapabilty();
  const indus_res = await dashboardService.getIndustry();
  const client_res = await dashboardService.getClient();
  const ptype_res = await dashboardService.getProjectType();
  const pstatus_res = await dashboardService.getProjectStatus();
  const delivery_res = await dashboardService.getDeliveryType();
  const engagement_res = await dashboardService.getEngagementType();
  res.send({
    organization: org_res,
    country: country_res,
    capability: cap_res,
    industry: indus_res,
    client: client_res,
    projectType: ptype_res,
    projectStatus: pstatus_res,
    deliveryType: delivery_res,
    engagementType: engagement_res,
  });
});

module.exports = {
  index,
  getfilter,
};
