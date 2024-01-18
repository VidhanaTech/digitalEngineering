import VxArticles from "./pages/ValueExperience/VxArticles";
import VxDashboard from "./pages/ValueExperience/VxDashboard";

export const Routes = {
  // pages
  Presentation: "/",
  Transactions: "/transactions",
  Settings: "/settings",
  Upgrade: "/upgrade",
  BootstrapTables: "/tables/bootstrap-tables",
  Billing: "/examples/billing",
  Invoice: "/examples/invoice",

  // ForgotPassword: "/examples/forgot-password",
  ResetPassword: "/examples/reset-password",
  Lock: "/examples/lock",
  NotFound: "/examples/404",
  ServerError: "/examples/500",

  Signin: "/login",
  Signup: "/register",
  ForgotPassword: "/forgot-password",
  DashboardOverview: "/dashboard",
  DashboardOverview_1: "/dashboard_1",
  KMDashboard: "/kmdashboard/overview",
  KMDashboard_1: "/kmdashboard/overview_1",
  KMArticles: "/kmarticles/overview",
  KMUnpublished: "/kmunpublished",
  KMUpdateArticle: "/kmunpublished/updatearticle",
  KMViewArticle: "/kmmyarticle/viewarticle",
  ArticlesList: "/articleslist/overview",
  MyArticle: "/kmmyarticle",
  ChatGPT: "/chatgpt/overview",
  ResetPassword: "/resetPassword",
  UpdateArticle: "/kmmyarticle/editarticle",
  NormalUser: "/normaluser",
  DefaultPage: "/defaultpage",
  RegisterMsg: "/register/msg",
  //client

  ViewClient: "/view-client",
  SearchClient: "/search-clients",
  EditClient: "/edit-client",
  AddClient: "/add-client",

  //project
  AddProject: "/add-project",
  EditProject: "/edit-project",
  ViewProject: "/view-project",
  TeamComposition: "/team-composition",
  ViewProjectHistory: "/project-history",
  SearchProjectSummary: "/project-summary",
  EditProjectStatus: "/edit-project-status",

  ManageLookUp: "/lookup",
  // docs
  DocsOverview: "/documentation/overview",
  DocsDownload: "/documentation/download",
  DocsQuickStart: "/documentation/quick-start",
  DocsLicense: "/documentation/license",
  DocsFolderStructure: "/documentation/folder-structure",
  DocsBuild: "/documentation/build-tools",
  DocsChangelog: "/documentation/changelog",

  // WSR
  WST: "/wst",

  // USER and ROLE management
  Roles: "/roles",
  UserM: "/users",
  createUsr: "/users/create",
  RegisterLit: "/user-regoster-list",
  ApproveUser: "/approve-user",
  editUsr: "/users/edit",
  createRol: "/roles/create",
  EditRole: "/roles/edit",

  // Value Experience
  VxDashboard: "/vxdashboard",
  VxArticles: "/vxarticles",

  //New Articles
  NewArticles: "/newarticles",
  ViewNewArticles: "/viewnewarticles",

  //Leave Management
  ApplyLeave: "/leave-apply",
  LeaveDashboard: "/leave-dashboard",

  //TeamMembers
  TeamMembers: "/team-members",

  //Rewards
  Rewards: "/rewards",

  // Event
  AddEvent: "/add-event",
  EditEvent: "/edit-event",
  //searchemployee
  SearchEmployee: "/search-employee",
  AddDetails: "/add-details",
  ViewEvent: "/view-event",
  EventRegister: "/event-register",
  EventList: "/event-list",

  //New Dashboard
  NewDashboard: "/new-dashboard",
  ViewEventRegister: "/event-details",

  //New Page  
  NewPage:"/new-page",

  //uploadArticles
  ArticlesUpload:"/articles-upload",

  //approvereview
  ApproveReview:"/approve-review",
};
