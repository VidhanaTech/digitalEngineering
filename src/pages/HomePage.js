import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Routes as appRoutes } from "../routes";

// pages
import DashboardOverview from "./dashboard/DashboardOverview";
import DashboardOverview_1 from "./dashboard/Dashboard_1";
import Signin from "./SignIn/Signin";
import SignUp from "./SignUp/SignUp";
import ForgotPassword from "./ForgotPassword/ForgotPassword";
import ResetPassword from "./ResetPassword/ResetPassword";
import Lock from "./examples/Lock";
import NotFoundPage from "./examples/NotFound";
import ServerError from "./examples/ServerError";
import NormalUser from "./NormalUser/NormalUser";
import ViewEventRegister from "./Events/ViewEventRegister";
// documentation pages

// components
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";

import ViewClient from "./Client/ViewClient/ViewClient";
import SearchClient from "./Client/SearchClient/SearchClient";
import AddClient from "./Client/AddClient/AddClient";
import AuthGuard from "../common/gaurd/AuthGaurd";
import EditClient from "./Client/EditClient/EditClient";
import ManageLookUp from "./ManageLookUp/ManageLookUp";

//project
import EditProjectStatus from "./Project/EditProjectStatus";
import SearchProjectSummary from "./Project/SearchProjectSummary";
import AddProject from "./Project/AddProject";
import ViewHistory from "./Project/ViewHistory";

//WST
import WST from "./wst/Defaulters";

//user

import User from "./usermanagement/Users/user";

//roles

import Roles from "./usermanagement/Roles/roles";

//create role and user

import CreateRole from "./usermanagement/CreateRoles/createrole";
import CreateUser from "./usermanagement/CreateUsers/createuser";
import EditRole from "./usermanagement/EditRole/EditRole";
import EditUser from "./usermanagement/EditUser/EditUser";
import RegisterList from "./usermanagement/Users/RegisterList";
import ApproveUser from "./usermanagement/Users/ApproveUser";
import TeamComposition from "./Project/TeamComposition";
import { ToastContainer } from "react-toastify";
import { SidebarKM } from "../components/SidebarKM";

//Knowledge Management
import KMDashboard, { Dashboard } from "./KnowledgeManagement/KMDashboard";
import KMDashboard1 from "./KnowledgeManagement/KMDashboard_1";
import KMArticles from "./KnowledgeManagement/KMArticles";
import ArticlesList from "./KnowledgeManagement/ArticlesList";
import ChatGPT from "./KnowledgeManagement/ChatGPT";
import KMUnpublished from "./KnowledgeManagement/KmUnpublished";
import ApproveArticle from "./KnowledgeManagement/ApproveArticle";
import ApproveVxArticle from "./KnowledgeManagement/ApproveVxArticle";
import MyArticle from "./KnowledgeManagement/MyArticles";
import UpdateArticle from "./KnowledgeManagement/UpdateArticle";
import UpdateVxArticle from "./KnowledgeManagement/UpdateVxArticle";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { collapseIcon } from "../actions/actions";
import DefaultPage from "../common/DefaultPage";
import RegisterMsg from "../common/RegisterMsg";

//Value Experience
import VxDashboard from "./ValueExperience/VxDashboard";
import VxArticles from "./ValueExperience/VxArticles";
import NewArticles from "./NewArticles/NewArticles";
import ViewArticle from "./KnowledgeManagement/ViewArticle";
//Leave Management
import ApplyLeave from "./LeaveManagement/ApplyLeave";
import LeaveDashboard from "./LeaveManagement/LeaveDashboard";
import TeamMembers from "./TeamMembers/TeamMembers";
//Events
import AddEvent from "./Events/addevent";
import EditEvent from "./Events/editevent";
import Viewevent from "./Events/viewevent";
import EventCard from "./Events/EventRegister";
//Employee Details
import SearchEmployee from "./Employee/SearchEmployee";
import AddDetails from "./Employee/AddDetails";
import Eventlist from "./Events/Eventlist";

//rewards
import Rewards from "./Rewards/Rewards";
import NewDashboard from "./dashboard/NewDashboard";

//upload articles
import ArticlesUpload from "./KnowledgeManagement/ArticlesUpload";

//New Page
import Newpage from "./Newpage/Newpage";

//approve review
import ApproveReview from "./ApproveReview/ApproveReview";

const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Route
      {...rest}
      render={(props) => (
        <>
          {" "}
          <Preloader show={loaded ? false : true} /> <Component {...props} />{" "}
        </>
      )}
    />
  );
};

const HomePage = (state) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const [showSideNav, setShowSideNav] = useState(false);

  const location = useLocation();
  useEffect(() => {
    if (!state.user) navigate("/");
    dispatch(collapseIcon(false));
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (
      window.location.hash === appRoutes.Presentation ||
      window.location.hash === "" ||
      window.location.hash === "#/" ||
      window.location.hash.indexOf(appRoutes.Signin) > -1 ||
      window.location.hash.indexOf(appRoutes.Signup) > -1 ||
      window.location.hash === "#/forgot-password"
    ) {
      setShowSideNav(false);
    } else {
      setShowSideNav(true);
    }
    // dispatch(collapseIcon(false));
  }, [location]);

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem("settingsVisible") === "false" ? false : true;
  };

  const [showSettings, setShowSettings] = useState(
    localStorageIsSettingsVisible
  );

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem("settingsVisible", !showSettings);
  };

  return (
    <>
      <Preloader show={loaded ? false : true} />
      {showSideNav && <Navbar sidebar={showSideNav} />}
      <main
        className={
          showSideNav === false ? (
            <></>
          ) : !state.collapse ? (
            state.showSideBar ? (
              "content transition-all duration-300 relative"
            ) : (
              "content lg:pl-14  transition-all duration-300 relative"
            )
          ) : state.showSideBar ? (
            "content transition-all duration-300 relative"
          ) : (
            "content lg:pl-72 transition-all duration-300 relative"
          )
        }
      >
        {showSideNav && <Sidebar />}
        <div className={showSideNav ? "maincontent" : ""}>
          <ToastContainer />
          <Routes>
            <Route exact path={appRoutes.Presentation} element={<Signin />} />
            <Route exact path={appRoutes.Signin} element={<Signin />} />
            <Route
              exact
              path={appRoutes.ResetPassword}
              element={<ResetPassword />}
            />
            <Route
              exact
              path={appRoutes.DefaultPage}
              element={<DefaultPage />}
            />
            <Route
              exact
              path={appRoutes.RegisterMsg}
              element={<RegisterMsg />}
            />
            <Route exact path={appRoutes.NormalUser} element={<NormalUser />} />

            <Route exact path={appRoutes.Signup} element={<SignUp />} />
            <Route
              exact
              path={appRoutes.ForgotPassword}
              element={<ForgotPassword />}
            />
            <Route
              exact
              path={appRoutes.ApproveUser}
              element={<ApproveUser />}
            />

            <Route
              exact
              path={appRoutes.ApplyLeave}
              element={
                <AuthGuard
                  path={appRoutes.ApplyLeave}
                  component={<ApplyLeave />}
                />
              }
            />

            <Route
              exact
              path={appRoutes.ArticlesUpload}
              element={
                <AuthGuard
                  path={appRoutes.ArticlesUpload}
                  component={<ArticlesUpload />}
                />
              }
            />

            <Route
              exact
              path={appRoutes.ApproveReview}
              element={
                <AuthGuard
                  path={appRoutes.ApproveReview}
                  component={<ApproveReview />}
                />
              }
            />

            <Route
              exact
              path={appRoutes.LeaveDashboard}
              element={
                <AuthGuard
                  path={appRoutes.LeaveDashboard}
                  component={<LeaveDashboard />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.Rewards}
              element={
                <AuthGuard path={appRoutes.Rewards} component={<Rewards />} />
              }
            />
            <Route
              exact
              path={appRoutes.TeamMembers}
              element={
                <AuthGuard
                  path={appRoutes.TeamMembers}
                  component={<TeamMembers />}
                />
              }
            />

            <Route
              exact
              path={appRoutes.AddEvent}
              element={
                <AuthGuard path={appRoutes.AddEvent} component={<AddEvent />} />
              }
            />

            <Route
              exact
              path={appRoutes.EditEvent}
              element={
                <AuthGuard
                  path={appRoutes.EditEvent}
                  component={<EditEvent />}
                />
              }
            />

            <Route
              exact
              path={appRoutes.SearchEmployee}
              element={
                <AuthGuard
                  path={appRoutes.SearchEmployee}
                  component={<SearchEmployee />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.AddDetails}
              element={
                <AuthGuard
                  path={appRoutes.AddDetails}
                  component={<AddDetails />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.ViewClient}
              element={
                <AuthGuard
                  path={appRoutes.ViewClient}
                  component={<ViewClient />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.SearchClient}
              element={
                <AuthGuard
                  path={appRoutes.SearchClient}
                  component={<SearchClient />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.AddClient}
              element={
                <AuthGuard
                  path={appRoutes.AddClient}
                  component={<AddClient />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.TeamComposition}
              element={
                <AuthGuard
                  path={appRoutes.TeamComposition}
                  component={<TeamComposition />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.EditClient}
              element={
                <AuthGuard
                  path={appRoutes.EditClient}
                  component={<EditClient />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.EditProjectStatus}
              element={
                <AuthGuard
                  path={appRoutes.EditProjectStatus}
                  component={<EditProjectStatus />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.SearchProjectSummary}
              element={
                <AuthGuard
                  path={appRoutes.SearchProjectSummary}
                  component={<SearchProjectSummary />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.AddProject}
              element={
                <AuthGuard
                  path={appRoutes.AddProject}
                  component={<AddProject />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.ViewProject}
              element={
                <AuthGuard
                  path={appRoutes.ViewProject}
                  component={<AddProject />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.EditProject}
              element={
                <AuthGuard
                  path={appRoutes.EditProject}
                  component={<AddProject />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.ViewProjectHistory}
              element={
                <AuthGuard
                  path={appRoutes.ViewProjectHistory}
                  component={<ViewHistory />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.ForgotPassword}
              element={<ForgotPassword />}
            />
            <Route
              exact
              path={appRoutes.ResetPassword}
              element={<ResetPassword />}
            />
            <Route
              exact
              path={appRoutes.Lock}
              element={<AuthGuard path={appRoutes.Lock} component={<Lock />} />}
            />
            <Route exact path={appRoutes.NotFound} element={<NotFoundPage />} />
            <Route
              exact
              path={appRoutes.ServerError}
              element={<ServerError />}
            />
            {/* pages */}
            <Route
              exact
              path={appRoutes.DashboardOverview}
              element={
                <AuthGuard
                  path={appRoutes.DashboardOverview}
                  component={<DashboardOverview />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.DashboardOverview_1}
              element={
                <AuthGuard
                  path={appRoutes.DashboardOverview_1}
                  component={<DashboardOverview_1 />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.WST}
              element={<AuthGuard path={appRoutes.WST} component={<WST />} />}
            />
            <Route
              exact
              path={appRoutes.UserM}
              element={
                <AuthGuard path={appRoutes.UserM} component={<User />} />
              }
            />
            <Route
              exact
              path={appRoutes.RegisterLit}
              element={
                <AuthGuard
                  path={appRoutes.RegisterLit}
                  component={<RegisterList />}
                />
              }
            />
            {/* <Route
              exact
              path={appRoutes.ApproveUser}
              element={
                <AuthGuard
                  path={appRoutes.ApproveUser}
                  component={<ApproveUser />}
                />
              }
            /> */}
            <Route
              exact
              path={appRoutes.Roles}
              element={
                <AuthGuard path={appRoutes.Roles} component={<Roles />} />
              }
            />
            <Route
              exact
              path={appRoutes.createRol}
              element={
                <AuthGuard
                  path={appRoutes.createRol}
                  component={<CreateRole />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.EditRole}
              element={
                <AuthGuard path={appRoutes.EditRole} component={<EditRole />} />
              }
            />
            <Route
              exact
              path={appRoutes.createUsr}
              element={
                <AuthGuard
                  path={appRoutes.createUsr}
                  component={<CreateUser />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.editUsr}
              element={
                <AuthGuard path={appRoutes.editUsr} component={<EditUser />} />
              }
            />
            <Route
              exact
              path={appRoutes.ManageLookUp}
              element={
                <AuthGuard
                  path={appRoutes.ManageLookUp}
                  component={<ManageLookUp />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.KMDashboard}
              element={
                <AuthGuard
                  path={appRoutes.KMDashboard}
                  component={<KMDashboard />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.KMDashboard_1}
              element={
                <AuthGuard
                  path={appRoutes.KMDashboard_1}
                  component={<KMDashboard1 />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.KMArticles}
              element={
                <AuthGuard
                  path={appRoutes.KMArticles}
                  component={<KMArticles />}
                />
              }
            />

            <Route
              exact
              path={appRoutes.ArticlesList}
              element={
                <AuthGuard
                  path={appRoutes.ArticlesList}
                  component={<ArticlesList />}
                />
              }
            />

            <Route
              exact
              path={appRoutes.KMUnpublished}
              element={
                <AuthGuard
                  path={appRoutes.KMUnpublished}
                  component={<KMUnpublished />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.KMViewArticle}
              element={
                <AuthGuard
                  path={appRoutes.KMViewArticle}
                  // component={<ApproveArticle />}
                  component={
                    location?.state?.user?.type == 4 ? (
                      <ApproveVxArticle />
                    ) : (
                      <ApproveArticle />
                    )
                  }
                />
              }
            />
            <Route
              exact
              path={appRoutes.KMUpdateArticle}
              element={
                <AuthGuard
                  path={appRoutes.KMUpdateArticle}
                  // component={<ApproveArticle />}
                  component={
                    location?.state?.user?.type == 4 ? (
                      <ApproveVxArticle />
                    ) : (
                      <ApproveArticle />
                    )
                  }
                />
              }
            />
            <Route
              exact
              path={appRoutes.ViewEvent}
              element={
                <AuthGuard
                  path={appRoutes.ViewEvent}
                  component={<Viewevent />}
                />
              }
            />

            <Route
              exact
              path={appRoutes.EventRegister}
              element={
                <AuthGuard
                  path={appRoutes.EventRegister}
                  component={<EventCard />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.MyArticle}
              element={
                <AuthGuard
                  path={appRoutes.MyArticle}
                  component={<MyArticle />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.UpdateArticle}
              element={
                <AuthGuard
                  path={appRoutes.UpdateArticle}
                  component={
                    location.state ? (
                      location.state.hasOwnProperty("user") ? (
                        location.state.user.hasOwnProperty("type") ? (
                          location.state.user.type == 4 ? (
                            <UpdateVxArticle />
                          ) : (
                            <UpdateArticle />
                          )
                        ) : null
                      ) : null
                    ) : null
                  }
                />
              }
            />
            <Route
              exact
              path={appRoutes.ViewEventRegister}
              element={
                <AuthGuard
                  path={appRoutes.ViewEventRegister}
                  component={<ViewEventRegister />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.ChatGPT}
              element={
                <AuthGuard path={appRoutes.ChatGPT} component={<ChatGPT />} />
              }
            />
            <Route
              exact
              path={appRoutes.VxDashboard}
              element={
                <AuthGuard
                  path={appRoutes.VxDashboard}
                  component={<VxDashboard />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.VxArticles}
              element={
                <AuthGuard
                  path={appRoutes.vxArticles}
                  component={<VxArticles />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.NewArticles}
              element={
                <AuthGuard
                  path={appRoutes.NewArticles}
                  component={<NewArticles />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.ViewNewArticles}
              element={
                <AuthGuard
                  path={appRoutes.ViewNewArticles}
                  component={<ViewArticle />}
                />
              }
            />

            <Route
              exact
              path={appRoutes.EventList}
              element={
                <AuthGuard
                  path={appRoutes.EventList}
                  component={<Eventlist />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.NewDashboard}
              element={
                <NewDashboard
                  path={appRoutes.NewDashboard}
                  component={<NewDashboard />}
                />
              }
            />
            <Route
              exact
              path={appRoutes.NewPage}
              element={
                <AuthGuard path={appRoutes.NewPage} component={<Newpage />} />
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        {/* {showSideNav && (
          <Footer toggleSettings={toggleSettings} showSettings={showSettings} />
        )} */}
      </main>
    </>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(HomePage);
