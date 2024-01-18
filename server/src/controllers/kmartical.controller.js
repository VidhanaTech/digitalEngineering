const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { kmarticalService, userService, dashboardService } = require('../services');
const multer = require('multer');
const path = require('path');
const { EmailSend } = require('../services/mail.service');

const addKMArtical = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.addKMArtical(req.body);
  res.send(kmartical);
});

const addKMEvent = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.addKMEvent(req.body);
  res.send(kmartical);
});

const KMEventList = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.KMEventList(req.body);
  res.send(kmartical);
});

const createArticleAttachment = catchAsync(async (req, res) => {
  const article = await kmarticalService.createArticleAttachment(req);
  if (article == 'success') {
    res.send({ lookup: 'Article attachment added successfully' });
  } else {
    res.send({ error: article });
  }
});

const uploadArticleAttachment = catchAsync(async (req, res) => {
  const article = await kmarticalService.uploadArticleAttachment(req);
  if (article == 'success') {
    res.send({ lookup: 'Article attachment added successfully' });
  } else {
    res.send({ error: article });
  }
});

const createEventAttachment = catchAsync(async (req, res) => {
  const article = await kmarticalService.createEventAttachment(req);
  if (article == 'success') {
    res.send({ lookup: article });
  } else {
    res.send({ error: article });
  }
});

const ckEditorImaPath = catchAsync(async (req, res) => {
  let filePath = req.file.destination + '/' + req.file.filename;
  filePath = filePath.substring(1);
  const filename = req.file.originalname;
  res.send({ filePath: filePath });
});

const searchKMArtical = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.searchKMArtical(req.body);
  res.send(kmartical);
});

const addLikeByArtical = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.addLikeByArtical(req.body);
  res.send(kmartical);
});

const addCommentByArtical = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.addCommentByArtical(req.body);
  res.send(kmartical);
});

const disLikeArtical = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.disLikeArtical(req.body);
  res.send(kmartical);
});

const searchCount = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.searchCount(req.body);
  res.send(kmartical);
});

const GetsearchCount = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.GetsearchCount(req.body);
  res.send(kmartical);
});

const searchSuccCount = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.searchSuccCount(req.body);
  res.send(kmartical);
});

const GetsearchSuccCount = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.GetSearchSuccCount(req.body);
  res.send(kmartical);
});

const GetUsersDataBarChart = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.GetUsersDataBarChart(req.body);
  res.send(kmartical);
});

const TotalRegisteredUsersCount = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.TotalRegisteredUsersCount(req.body);
  res.send(kmartical);
});

const deleteArticalComment = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.deleteArticalComment(req.body);
  res.send(kmartical);
});

const topContributors = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.topContributors(req.body);
  res.send(kmartical);
});

const latestArtical = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.latestArtical(req.body);
  let param = req.body.des ? req.body.des : '';
  const category = await kmarticalService.articleCategorywiseCount(param);
  kmartical.forEach((row, i) => {
    let earry = [];
    if (row.FilePath) {
      let fileData = row.FilePath.split(', ');
      let fileIds = row.FileId.split(', ');
      let fName = row.FileName.split(', ');
      if (fileData.length > 0) {
        fileData.map((res, i) => {
          earry.push({ Id: fileIds[i], FilePath: res, FileName: fName[i] });
        });
      }
    }

    kmartical[i].FilePath = earry;
    kmartical[i].commentList = [];
  });
  res.send({ data: kmartical, category: category });
});

const eventgetById = catchAsync(async (req, res) => {
  const event = await kmarticalService.eventgetById(req.params.id);
  console.log(event);
  var promises = [];
  event.forEach(async (row, i) => {
    promises.push(
      kmarticalService.eventattachById(req.params.id, 1).then((res) => {
        if (res.length > 0) event[i].thumbImg = res;
        else event[i].thumbImg = [];
      })
    );
  });

  var attPromises = [];
  event.forEach(async (row, i) => {
    attPromises.push(
      kmarticalService.eventattachById(req.params.id, 2).then((res) => {
        if (res.length > 0) event[i].bannerImg = res;
        else event[i].bannerImg = [];
      })
    );
  });
  await Promise.all(promises);
  await Promise.all(attPromises);
  res.send(event);
});

const latestArticalnew = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.latestArticalnew(req.body);
  console.log(kmartical);
  kmartical.forEach((row, i) => {
    let earry = [];
    if (row.FilePath) {
      let fileData = row.FilePath.split(', ');
      let fileIds = row.FileId.split(', ');
      let fName = row.FileName.split(', ');
      if (fileData.length > 0) {
        fileData.map((res, i) => {
          earry.push({ Id: fileIds[i], FilePath: res, FileName: fName[i] });
        });
      }
    }

    kmartical[i].FilePath = earry;
  });
  res.send({ data: kmartical });
});

const articleList = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.articleList(req.body);
  res.send(kmartical);
});

const myarticle = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.myarticle(req.body);
  res.send(kmartical);
});

const kmarticledashboard = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.kmarticledashboard(req.body);
  res.send(kmartical);
});

const RevisionArticlesGetByUserId = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.RevisionArticlesGetByUserId(req.params.id);
  res.send({ data: kmartical });
});

const getUpandDownVotes = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.getUpandDownVotes(req.body);
  res.send({ data: kmartical });
});

const kmdashboard = catchAsync(async (req, res) => {
  // const kmartical = await kmarticalService.kmdashboard(req.body);
  let leadingRegioncount = await kmarticalService.leadingRegionCount(req.body);
  let leadingRegionuserscount = await  kmarticalService.leadingRegionCount(req.body);
  let leadingRegionData = await  kmarticalService.leadingRegionCount(req.body);
  let totalarticle = await kmarticalService.kmdashboardtotalarticle(req.body);
  let totalusers = await kmarticalService.kmdashtotaltotalusers(req.body);
  let activeusers = await kmarticalService.kmdashtotalactivetotalusers(req.body);
  let starproject = await kmarticalService.kmdashboardstarproject(req.body);
  let starprojectRegion =await kmarticalService.kmdashboardstarproject(req.body);
  let starofmonth = await kmarticalService.kmdashboardstarofmonth(req.body);
  let starofmonthRegion = await kmarticalService.kmdashboardstarofmonth(req.body);
  let starofmonthProjectName = await kmarticalService.kmdashboardstarofmonth(req.body);
  let casestudies = await kmarticalService.kmdashboardtotalcaststudies(req.body);
  let bestpractices = await kmarticalService.kmdashboardtotalbestpractices(req.body);
  // let teamcontribution = await kmarticalService.kmdashboard_teamcontribution(req.body);
  let artifactConsumption = await kmarticalService.artifactConsumptionCount(req.body);
  let knowledgeCredits = await kmarticalService.knowledgeCreditCount(req.body);
  let EnthusiastBadges = await kmarticalService.badgesCount(req.body);
  let EventCount = await kmarticalService.EventDashboardCount(req.body);
  let customerAccolades = await kmarticalService.CADashboardCount(req.body);
  let ArtifactsPublishedCount = await kmarticalService.ArtifactsPublishedCount(req.body);
  let knowledgeCreditsContri = await kmarticalService.knowledgeCreditsContriConsumption(req.body);
  let knowledgeCreditsConsumption = await kmarticalService.knowledgeCreditsContriConsumption(req.body);
  let knowledgeCreditsTotalPoints = await kmarticalService.knowledgeCreditsContriConsumption(req.body);
  let GetsearchCount= await kmarticalService.GetsearchCount(req.body);
  let EventsData = await kmarticalService.EventsData(req.body);
  let activeuserstotal= await kmarticalService.kmdashtotalactivetotalusers(req.body);



  req.body.year = req.body.lastYear;
  req.body.month = req.body.lastMonth;

  let totalarticle_precent = await kmarticalService.kmdashboardtotalarticle(req.body);
  let totalusers_precent = await kmarticalService.kmdashtotaltotalusers(req.body);
  let activeusers_precent = await kmarticalService.kmdashtotalactivetotalusers(req.body);
  // let starproject_precent = await kmarticalService.kmdashboardstarproject(req.body);
  let casestudies_precent = await kmarticalService.kmdashboardtotalcaststudies(req.body);
  let bestpractices_precent = await kmarticalService.kmdashboardtotalbestpractices(req.body);
  let leadingRegioncount_precent = await kmarticalService.leadingRegionCount(req.body);
  let artifactConsumption_precent = await kmarticalService.artifactConsumptionCount(req.body);
  let KnowledgeCredits_precent = await kmarticalService.knowledgeCreditCount(req.body);
  let EventCount_precent = await kmarticalService.EventDashboardCount(req.body);
  let customerAccolades_precent = await kmarticalService.CADashboardCount(req.body);

  if (totalarticle_precent.length > 0) totalarticle_precent = totalarticle_precent[0].totalarticle;
  else totalarticle_precent = 0;
  if (totalusers_precent.length > 0) totalusers_precent = totalusers_precent[0].totaluser;
  else totalusers_precent = 0;
  if (casestudies_precent.length > 0) casestudies_precent = casestudies_precent[0].totalarticle;
  else casestudies_precent = 0;
  if (bestpractices_precent.length > 0) bestpractices_precent = bestpractices_precent[0].totalarticle;
  else bestpractices_precent = 0;
  if (leadingRegioncount_precent.length > 0) leadingRegioncount_precent = leadingRegioncount_precent[0].LocationName;
  else leadingRegioncount_precent = 0;
  if (artifactConsumption_precent.length > 0) artifactConsumption_precent = artifactConsumption_precent[0].ReadingPoints;
  else artifactConsumption_precent = 0;
  if (KnowledgeCredits_precent.length > 0) KnowledgeCredits_precent = KnowledgeCredits_precent[0].ReadingPoints;
  else KnowledgeCredits_precent = 0;
  if (EventCount_precent.length > 0) EventCount_precent = EventCount_precent[0].EventCount;
  else EventCount_precent = 0;
  if (customerAccolades_precent.length > 0) customerAccolades_precent = customerAccolades_precent[0].CACount;
  else customerAccolades_precent = 0;
  if (activeusers_precent.length > 0) activeusers_precent = activeusers_precent[0].activeusers;
  else activeusers_precent = 0;

  if (totalarticle.length > 0) totalarticle = totalarticle[0].totalarticle;
  else totalarticle = 0;

  if (totalusers.length > 0) totalusers = totalusers[0].totaluser;
  else totalusers = 0;
  if (activeusers.length > 0) activeusers = activeusers[0].activeusers;
  else activeusers = 0;
  if (starproject.length > 0) starproject = starproject[0].startproject;
  else starproject = 0;

  if(starprojectRegion.length >0) starprojectRegion = starprojectRegion[0].RegionName;
  else starprojectRegion = 0;

  if (starofmonth.length > 0) starofmonth = starofmonth[0].statofmonth;
  else starofmonth = 0;

  if (starofmonthProjectName.length > 0) starofmonthProjectName = starofmonthProjectName[0].projectName;
  else starofmonthProjectName = '';

  if (starofmonthRegion.length > 0 )starofmonthRegion = starofmonthRegion[0].RegionName;
  else starofmonthRegion = 0;
  if (casestudies.length > 0) casestudies = casestudies[0].totalarticle;
  else casestudies = 0;

  if (bestpractices.length > 0) bestpractices = bestpractices[0].totalarticle;
  else bestpractices = 0;

  if (leadingRegioncount.length > 0) leadingRegioncount = leadingRegioncount[0].LocationName;
  else leadingRegioncount = 0; 

  if (leadingRegionuserscount.length > 0) leadingRegionuserscount= leadingRegionuserscount[0].userCount;
  else leadingRegionuserscount = 0;

  if (leadingRegionData.length > 0) leadingRegionData= leadingRegionData;
  else leadingRegionData = 0;

  if (artifactConsumption.length > 0) artifactConsumption = artifactConsumption[0].ReadingPoints;
  else artifactConsumption = 0;

  if (knowledgeCredits.length > 0) knowledgeCredits = knowledgeCredits[0].ReadingPoints;
  else knowledgeCredits = 0;

  if (EventCount.length > 0) EventCount = EventCount[0].EventCount;
  else EventCount = 0;

  if (customerAccolades.length > 0) customerAccolades = customerAccolades[0].CACount;
  else customerAccolades = 0;

  if (ArtifactsPublishedCount.length > 0) ArtifactsPublishedCount = ArtifactsPublishedCount[0].totalpublished;
  else ArtifactsPublishedCount = 0;

  if (knowledgeCreditsContri.length > 0) knowledgeCreditsContri = knowledgeCreditsContri[0].ContributionPoints;
  else knowledgeCreditsContri = 0;

  if (knowledgeCreditsConsumption.length > 0) knowledgeCreditsConsumption = knowledgeCreditsConsumption[0].ConsumptionPoints;
  else knowledgeCreditsConsumption = 0;

  if (knowledgeCreditsTotalPoints.length > 0) knowledgeCreditsTotalPoints = knowledgeCreditsTotalPoints[0].TotalPoints;
  else knowledgeCreditsTotalPoints = 0;

  if (GetsearchCount.length > 0) GetsearchCount = GetsearchCount;
  else GetsearchCount = 0;

  if (EventsData.length > 0) EventsData = EventsData;
  else EventsData = 0;

  if (activeuserstotal.length > 0) activeuserstotal = activeuserstotal[0].totalactiveusers;
  else activeuserstotal = 0;

  let enthusiastBadge = 0;
  let cataystBadge = 0;
  let proBadge = 0;
  let championBadge = 0;

  if (EnthusiastBadges.length > 0) {
    if (EnthusiastBadges[0].Enthusiast) enthusiastBadge = EnthusiastBadges[0].Enthusiast;

    if (EnthusiastBadges[0].Catalyst) cataystBadge = EnthusiastBadges[0].Catalyst;

    if (EnthusiastBadges[0].Pro) proBadge = EnthusiastBadges[0].Pro;

    if (EnthusiastBadges[0].Champion) championBadge = EnthusiastBadges[0].Champion;
  }

  let data = {
    kmartical: [
      {
        totalarticle: totalarticle,
        totalusers: totalusers,
        activeusers: activeusers,
        starproject: starproject,
        starprojectRegion:starprojectRegion,
        starofmonth: starofmonth,
        starofmonthProjectName: starofmonthProjectName,
        starofmonthRegion:starofmonthRegion,
        casestudies: casestudies,
        bestpractices: bestpractices,
        totalarticle_precent: totalarticle_precent,
        totalusers_precent: totalusers_precent,
        casestudies_precent: casestudies_precent,
        bestpractices_precent: bestpractices_precent,
        leadingRegioncount: leadingRegioncount,
        leadingRegionuserscount:leadingRegionuserscount,
        knowledgeCredits: knowledgeCredits,
        KnowledgeCredits_precent: KnowledgeCredits_precent,
        artifactConsumption: artifactConsumption,
        artifactConsumption_precent: artifactConsumption_precent,
        EnthusiastBadges: enthusiastBadge,
        cataystBadge: cataystBadge,
        proBadge: proBadge,
        ArtifactsPublishedCount: ArtifactsPublishedCount,
        championBadge: championBadge,
        EventCount: EventCount,
        EventCount_precent: EventCount_precent,
        customerAccolades: customerAccolades,
        customerAccolades_precent: customerAccolades_precent,
        activeusers_precent: activeusers_precent,
        knowledgeCreditsContri: knowledgeCreditsContri,
        knowledgeCreditsConsumption: knowledgeCreditsConsumption,
        knowledgeCreditsTotalPoints:knowledgeCreditsTotalPoints,
        leadingRegionData: leadingRegionData,
        SearchCountData: GetsearchCount,
        EventsData: EventsData,
        activeuserstotal:activeuserstotal,
      },
    ],
    // teamcontribution: teamcontribution,
  };
  res.send(data);
});

const kmdashboardContributionSummary = catchAsync(async (req, res) => {
  let teamcontribution = await kmarticalService.kmdashboard_teamcontribution(req.body);
  let data = {
    teamcontribution: teamcontribution,
  };
  res.send(data);
});

const kmdashboardCaseStudies = catchAsync(async (req, res) => {
  let monthbycasestudy = await kmarticalService.kmdashboardMonthwiseCaseStudyCount(req.body);
  let monthbyknowledge = await kmarticalService.kmdashboardMonthwiseKnowledgeCount(req.body);
  let engagement = await kmarticalService.kmdashboardMonthwiseArticleCount(req.body);
  let monthbyvx = await kmarticalService.kmdashboardVxMonthwiseCount(req.body);
  let monthbysearch = await kmarticalService.kmdashboardMonthwiseSearchCount(req.body);

  let data = {
    casestudies: monthbycasestudy,
    knowledgewise: monthbyknowledge,
    engagement: engagement,
    vx: monthbyvx,
    search:monthbysearch,
  };
  res.send(data);
});

const kmdashboardClientCategory = catchAsync(async (req, res) => {
  let clientwise = await kmarticalService.kmdashboardClientwiseArticleCount(req.body);
  // let categorywise = await kmarticalService.kmdashboardArticleCount(req.body);
  let regionwise = await kmarticalService.kmdashboardRegionwiseArticleCount(req.body);
  let data = {
    clientwise: clientwise,
    // categorywise: categorywise,
    regionwise: regionwise,
  };
  res.send(data);
});

const articlecomments = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.articlecomments(req.body);
  var promises = [];
  kmartical.forEach(async (row, i) => {
    promises.push(
      kmarticalService.articlesubcomments({ id: row.Id }).then((res) => {
        kmartical[i].subcomments = res;
      })
    );
  });
  await Promise.all(promises);
  res.send(kmartical);
});

const kmarticleunpublished = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.kmarticleunpublished(req.body);
  res.send(kmartical);
});

const kmarticleMyReviewList = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.kmarticleMyReviewList(req.body);
  res.send(kmartical);
});

const UpvotesCount = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.UpvotesCount(req.body);
  res.send(kmartical);
});

const articlegeybyid = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.articlegeybyid(req.body);
  const filePath = await kmarticalService.getArticleAttachement(req.body);
  if (kmartical[0]) {
    if (filePath.length > 0) kmartical[0].FilePath = filePath;
    else kmartical[0].FilePath = [];
  }
  // console.log(kmartical);
  res.send(kmartical);
});

const article_approve = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.article_approve(req.body);
  res.send(kmartical);
});

const articleRevisionApply = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.articleRevisionApply(req.body);
  res.send(kmartical);
});

const articleRevisionGet = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.articleRevisionGet(req.params.id);
  res.send({ data: kmartical });
});

const articleRevisionSet = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.articleRevisionSet(req.body);
  res.send({ data: kmartical });
});

const cancelEvent = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.cancelEvent(req.body);
  const registerlist = await kmarticalService.eventRegisterListById(req.body);
  if (registerlist.length > 0) {
    registerlist.map(async (row) => {
      let info = {
        to: row.EmailId, // list of receivers
        subject: 'Event Register', // Subject line
        text: '', // plain text body
        html:
          `Dear ` +
          row.UserName +
          `
        <br>
        <br>
        Thank you for registration
        <br>`, // html body
      };
      let dd = await EmailSend(info);
    });
  }
  res.send(kmartical);
});

const eventRegister = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.eventRegister(req.body);
  if (!req.body.id) {
    let result = await userService.getUserDetailsById(req.body.userId);
    if (result) {
      let info = {
        to: result[0].EmailId, // list of receivers
        subject: 'Event Register', // Subject line
        text: '', // plain text body
        html:
          `Dear ` +
          result[0].FirstName +
          ` ` +
          result[0].LastName +
          `
        <br>
        <br>
        Thank you for registeration
        <br>`, // html body
      };
      let dd = await EmailSend(info);
    }
  }
  res.send(kmartical);
});

const eventRegisterForList = catchAsync(async (req, res) => {
  const event = await kmarticalService.eventRegisterForList(req.params.id);
  res.send(event);
});
const getPopularArticleList = catchAsync(async (req, res) => {
  const event = await kmarticalService.getPopularArticleList();
  res.send(event);
});
const reviewApproveList = catchAsync(async (req, res) => {
  const list = await kmarticalService.reviewApproveList();
  res.send(list);
});

const deleteAttachment = catchAsync(async (req, res) => {
  const user = await kmarticalService.deleteAttachment(req.params.id);
  if (user == 'success') {
    res.send({ lookup: 'Attachment deleted successfully' });
  } else {
    res.send({ error: user });
  }
});

const reviewApproveApply = catchAsync(async (req, res) => {
  const user = await kmarticalService.reviewApproveApply(req.body);
  if (user == 'success') {
    if (req.body.id) res.send({ lookup: 'Delete Successfully' });
    else res.send({ lookup: 'Approve Role Add Successfully' });
  } else {
    res.send({ error: user });
  }
});

const articleUPandDownVoteApply = catchAsync(async (req, res) => {
  const articleVotes = await kmarticalService.articleUPandDownVoteApply(req.body);
  res.send({ data: articleVotes });
});

const articleUPandDownVoteRevert = catchAsync(async (req, res) => {
  const articleVotes = await kmarticalService.articleUPandDownVoteRevert(req.body);
  res.send({ data: articleVotes });
});

const deleteEventAttachment = catchAsync(async (req, res) => {
  const user = await kmarticalService.deleteEventAttachment(req.params.id);
  if (user == 'success') {
    res.send({ lookup: 'Attachment deleted successfully' });
  } else {
    res.send({ error: user });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/article');
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

const eventStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/event');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const eventUpload = multer({
  storage: eventStorage,
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

const ckEditorStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/ckEditor');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const ckEditorUpload = multer({
  storage: ckEditorStorage,
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

const DownvotesCount = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.DownvotesCount(req.body);
  res.send(kmartical);
});

const GetUpvotesCount = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.GetUpvotesCount(req.body);
  res.send(kmartical);
});

const GetDownvotesCount = catchAsync(async (req, res) => {
  const kmartical = await kmarticalService.GetDownvotesCount(req.body);
  res.send(kmartical);
});

module.exports = {
  addKMArtical,
  addKMEvent,
  KMEventList,
  searchKMArtical,
  addLikeByArtical,
  addCommentByArtical,
  disLikeArtical,
  deleteArticalComment,
  topContributors,
  latestArtical,
  latestArticalnew,
  myarticle,
  kmarticledashboard,
  kmdashboard,
  articlecomments,
  articleList,
  createArticleAttachment,
  createEventAttachment,
  upload,
  eventUpload,
  kmarticleunpublished,
  kmarticleMyReviewList,
  articlegeybyid,
  article_approve,
  kmdashboardCaseStudies,
  ckEditorImaPath,
  kmdashboardClientCategory,
  deleteAttachment,
  articleRevisionApply,
  articleRevisionGet,
  eventgetById,
  articleRevisionSet,
  cancelEvent,
  eventRegisterForList,
  eventRegister,
  getPopularArticleList,
  deleteEventAttachment,
  reviewApproveApply,
  reviewApproveList,
  ckEditorUpload,
  uploadArticleAttachment,
  searchCount,
  GetsearchCount,
  TotalRegisteredUsersCount,
  UpvotesCount,
  GetUpvotesCount,
  DownvotesCount,
  GetDownvotesCount,
  RevisionArticlesGetByUserId,
  kmdashboardContributionSummary,
  searchSuccCount,
  GetsearchSuccCount,
  articleUPandDownVoteApply,
  getUpandDownVotes,
  GetUsersDataBarChart,
  articleUPandDownVoteRevert,
};
