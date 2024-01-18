import React, { useState, useEffect } from "react";
import ChevronDown from "../assets/img/icons/circle-chevron-down.svg";
import { Image } from "@themesberg/react-bootstrap";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Menu Icons
import ClientManagementIcon from "../assets/img/5-elements-icons/dashboard/client-management.svg";
import ProjectManagementIcon from "../assets/img/5-elements-icons/dashboard/project-management.svg";
import WSRDefaultersIcon from "../assets/img/5-elements-icons/dashboard/event.svg";
import KMDashboardIcon from "../assets/img/5-elements-icons/dashboard/executive-dashboard.svg";
import UserManagementIcon from "../assets/img/5-elements-icons/dashboard/user-management.svg";
import LookupIcon from "../assets/img/5-elements-icons/dashboard/lookup.svg";

// user management sub menu icon
import UserManageRole from "../assets/img/5-elements-icons/user-management/role.svg";
import UserManageUser from "../assets/img/5-elements-icons/user-management/users.svg";
import UserManageApprove from "../assets/img/5-elements-icons/user-management/approve-user.svg";

// config sub menu icon
import ApproveRole from "../assets/img/5-elements-icons/config/approve-role.svg";
import ArticleUpload from "../assets/img/5-elements-icons/config/artifact-upload.svg";
import RewardPoints from "../assets/img/5-elements-icons/config/reward-points.svg";

//client management sub icon
import CMClientListing from "../assets/img/5-elements-icons/client-management/clients.svg";
import CMClientAdd from "../assets/img/5-elements-icons/client-management/add-client.svg";

//project management sub icon
import PrjAddProjectIcon from "../assets/img/5-elements-icons/project-management/add-project.svg";
import PrjAddProjectTeamIcon from "../assets/img/5-elements-icons/project-management/add-team-member.svg";
import ProjectListingIcon from "../assets/img/5-elements-icons/project-management/project.svg";

import DashboardIcon from "../assets/img/icons/sidebar/icon-dashboard.svg";
import KMDashboard1Icon from "../assets/img/icons/sidebar/icon-km-dashboard_1.svg";
import KMArticlesIcon from "../assets/img/icons/sidebar/icon-km-articles.svg";
import MYArticlesIcon from "../assets/img/icons/sidebar/icon-my-articles.svg";
import KMApprovalIcon from "../assets/img/icons/sidebar/icon-km-approval.svg";
import ChatGPTIcon from "../assets/img/icons/sidebar/icon-chatgpt.svg";
import VXDashboardIcon from "../assets/img/icons/sidebar/icon-vx-dashboard.svg";
import VXArticlesIcon from "../assets/img/icons/sidebar/icon-vx-articles.svg";
import AddClientIcon from "../assets/img/icons/sidebar/AddClient.svg";
import ClientsIcon from "../assets/img/icons/sidebar/Clients.svg";
import AddProjectIcon from "../assets/img/icons/sidebar/AddProjects.svg";
import ProjectIcon from "../assets/img/icons/sidebar/Projects.svg";
import UsersIcon from "../assets/img/icons/sidebar/Users.svg";
import RolesIcon from "../assets/img/icons/sidebar/Roles.svg";
import ApproveUserIcon from "../assets/img/icons/sidebar/ApproveUser.svg";

import ConfigIcon from "../assets/img/5-elements-icons/dashboard/config.svg";
import { useDispatch } from "react-redux";
// import PropTypes from "prop-types";
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import { showSideBar } from "../actions/actions";
const Sidebar = (state) => {
  const dispatch = useDispatch();
  const iconMap = [
    { name: "DashboardIcon", icon: DashboardIcon },
    { name: "ClientManagementIcon", icon: ClientManagementIcon },
    { name: "ProjectManagementIcon", icon: ProjectManagementIcon },
    { name: "WSRDefaultersIcon", icon: WSRDefaultersIcon },
    { name: "KMDashboardIcon", icon: KMDashboardIcon },
    { name: "KMDashboard1Icon", icon: KMDashboard1Icon },
    { name: "KMArticlesIcon", icon: KMArticlesIcon },
    { name: "MYArticlesIcon", icon: MYArticlesIcon },
    { name: "KMApprovalIcon", icon: KMApprovalIcon },
    { name: "ChatGPTIcon", icon: ChatGPTIcon },
    { name: "VXDashboardIcon", icon: VXDashboardIcon },
    { name: "VXArticlesIcon", icon: VXArticlesIcon },
    { name: "LookupIcon", icon: LookupIcon },
    { name: "UserManagementIcon", icon: UserManagementIcon },
    { name: "AddClientIcon", icon: AddClientIcon },
    { name: "ClientIcon", icon: ClientsIcon },
    { name: "AddProjectIcon", icon: AddProjectIcon },
    { name: "ProjectIcon", icon: ProjectIcon },
    { name: "UsersIcon", icon: UsersIcon },
    { name: "RolesIcon", icon: RolesIcon },
    { name: "ApproveUserIcon", icon: ApproveUserIcon },
    { name: "UserManageRole", icon: UserManageRole },
    { name: "UserManageUser", icon: UserManageUser },
    { name: "ApproveRole", icon: ApproveRole },
    { name: "UserManageApprove", icon: UserManageApprove },
    { name: "ArticleUpload", icon: ArticleUpload },
    { name: "RewardPoints", icon: RewardPoints },
    { name: "ConfigIcon", icon: ConfigIcon },
    { name: "CMClientListing", icon: CMClientListing },
    { name: "CMClientAdd", icon: CMClientAdd },
    { name: "PrjAddProjectIcon", icon: PrjAddProjectIcon },
    { name: "PrjAddProjectTeamIcon", icon: PrjAddProjectTeamIcon },
    { name: "ProjectListingIcon", icon: ProjectListingIcon },
  ];

  // const [hideSidebar, setHideSidebar] = useState(false);
  const navigate = useNavigate();
  if (!state.user) navigate("/");
  const [showSubMenu, setShowSubMenu] = useState();
  const sections = [...new Set(state.roles.map((item) => item.SectionName))];
  const user = state.user;
  const getMenu = () => {
    const groupsArray = [...new Set(state.roles.map((item) => item.GroupName))];
    var groups = [];
    groupsArray.forEach((group) => {
      groups.push({ GroupName: group });
    });
    groups.forEach((group) => {
      state.roles.forEach((element) => {
        if (element.GroupName == group.GroupName) {
          if (!group.subMenus) {
            group.subMenus = [];
          }
          group.subMenus.push(element);
          group.ModuleIcon = element.ModuleIcon;
          group.SubMenu = element.SubMenu;
          group.IsVisible = element.MenuVisible;
          group.SubMenuIcon = element.SubMenuIcon;
          group.SectionName = element.SectionName;
          if (element.SubMenu == 0) {
            group.Path = element.Path;
          }
        }
      });
    });
    return groups;
  };

  const menus = getMenu();
  const activeMenu = menus.filter((item) => item.IsVisible === 1);
  const hashFragment = window.location.hash.slice(1);

  function getIconFilter(val) {
    let foundIcon = iconMap.find((icon) => icon.name === val);
    if (foundIcon) return foundIcon.icon;
    else return false;
  }
  useEffect(() => {
    dispatch(showSideBar(activeMenu.length < 2));
  }, []);

  return (
    <>
      {activeMenu.length > 1 && (
        <>
          <div
            className={
              !state.collapse
                ? "sidebar hidden lg:block lg:w-14 lg:hover:w-14 transition-all"
                : "sidebar lg:w-72 lg:hover:w-72 transition-all"
            }
          >
            {/* <FontAwesomeIcon
        icon={hideSidebar ? faAnglesRight : faAnglesLeft}
        className="absolute text-2xl text-white cursor-pointer top-1 right-1"
        onClick={() => collapseFunc()}
      /> */}
            {/* <div className="sidebar__profile">
        <Image
          src={ProfileImg}
          alt="profile"
          className="sidebar__profile--pic"
        />
        <div className="sidebar__profile--namesec">
          <p className="sidebar__profile--namesec-name">{user?.FirstName}</p>
          <p className="sidebar__profile--namesec-status">
            <Image
              src={CircleIcon}
              className="sidebar__profile--namesec-icon"
            />
            Online
          </p>
        </div>
      </div> */}
            {sections.map((s, i) => (
              <>
                <div
                  className={
                    !state.collapse
                      ? "lg:hidden lg:mt-4 mb-2 sidebar__title"
                      : "mb-2 sidebar__title"
                  }
                  key={i}
                ></div>
                <ul className={"sidebar__ul"} key={i}>
                  {menus.map((m, i) =>
                    s == m.SectionName ? (
                      m.IsVisible ? (
                        <>
                          <li className="sidebar__li" key={i}>
                            <a
                              title={m.GroupName}
                              onClick={() => {
                                if (m.SubMenu == 1 && m.subMenus?.length > 0) {
                                  setShowSubMenu(showSubMenu != i ? i : null);
                                } else {
                                  navigate(m.Path);
                                }
                              }}
                              className={
                                m.Path === hashFragment
                                  ? `sidebar__a sidebar__a--active`
                                  : `sidebar__a`
                              }
                            >
                              <div className="flex justify-start gap-4 items">
                                <span
                                  className="sidebar__a--span"
                                  title={!state.collapse ? m.GroupName : ""}
                                >
                                  <Image
                                    src={getIconFilter(m.ModuleIcon)}
                                    className="sidebar__icons--chevron noselect"
                                  />
                                </span>
                                <span
                                  className={!state.collapse ? `lg:hidden` : ""}
                                >
                                  {m.GroupName}
                                </span>
                              </div>

                              {state.collapse &&
                                m.SubMenu == 1 &&
                                m.subMenus?.length > 0 &&
                                (showSubMenu === i ? (
                                  <Image
                                    src={ChevronDown}
                                    style={{ width: "15px", height: "15px" }}
                                    className="sidebar__icons--chevron noselect"
                                  />
                                ) : (
                                  <FontAwesomeIcon
                                    icon={faCircleChevronRight}
                                  />
                                ))}
                            </a>
                            {m.SubMenu == 1 &&
                              m.subMenus?.length > 0 &&
                              showSubMenu === i && (
                                <ul className="sidebar__li--ul">
                                  {m.subMenus.map((sm, i) =>
                                    sm.IsVisible == 1 ? (
                                      <li
                                        className={
                                          sm.Path === hashFragment
                                            ? `sidebar__li--li sidebar__a--active`
                                            : `sidebar__li--li`
                                        }
                                        key={i}
                                      >
                                        <a
                                          title={sm.ModuleName}
                                          href="javascript:void(0)"
                                          onClick={() => {
                                            navigate(sm.Path);
                                          }}
                                          className={
                                            state.collapse
                                              ? "sidebar__li--a"
                                              : "sidebar__a"
                                          }
                                        >
                                          <div className="flex justify-start gap-4 items">
                                            <span className="sidebar__a--span">
                                              <Image
                                                src={
                                                  sm.SubMenuIcon
                                                    ? getIconFilter(
                                                        sm.SubMenuIcon
                                                      )
                                                    : AddClientIcon
                                                }
                                                className="sidebar__icons--chevron noselect"
                                              />{" "}
                                            </span>
                                            <span>{sm.ModuleName}</span>
                                          </div>
                                        </a>
                                      </li>
                                    ) : null
                                  )}
                                </ul>
                              )}
                          </li>
                        </>
                      ) : null
                    ) : null
                  )}
                </ul>
              </>
            ))}
            {/* <ul className="sidebar__ul">
        <li className="sidebar__li">
          <a
            href="javascript:void(0)"
            onClick={() => {
              navigate(Routes.DashboardOverview)
              setIsActive(!isActive)
            }}
            className={
              isActive ? `sidebar__a sidebar__a--active` : `sidebar__a`
            }
          >
            <span className="sidebar__a--span">
              <FontAwesomeIcon
                icon={faHouseChimneyWindow}
                className="sidebar__icons"
              />
              Dashboard
            </span>
          </a>
        </li>
        <li className="sidebar__li">
          <a
            href="javascript:void(0)"
            onClick={() => {
              navigate(Routes.ManageLookUp)
              setIsActive(!isActive)
            }}
            className={
              isActive ? `sidebar__a sidebar__a--active` : `sidebar__a`
            }
          >
            <span className="sidebar__a--span">
              <FontAwesomeIcon
                icon={faCalendarDays}
                className="sidebar__icons"
              />
              Manage Lookups
            </span>
          </a>
        </li>
        <li className="sidebar__li">
          <a
            onClick={() => {
              setShowClient(!showClient)
              setIsActive(!isActive)
            }}
            className={
              isActive ? `sidebar__a sidebar__a--active` : `sidebar__a`
            }
          >
            <span className="sidebar__a--span">
              <FontAwesomeIcon
                // icon={faAddressBook}
                icon="address-book"
                className="sidebar__icons"
              />
              Client Management
            </span>
            <FontAwesomeIcon icon={faCircleChevronRight} />
          </a>
          {showClient && (
            <ul className="sidebar__li--ul">
              <li className="sidebar__li--li">
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    navigate(Routes.SearchClient)
                    setIsActive(!isActive)
                  }}
                  className="sidebar__li--a"
                >
                  <span className="sidebar__a--span">
                    Search Client Summary
                  </span>
                </a>
              </li>
            </ul>
          )}
        </li>
        <li className="sidebar__li">
          <a
            onClick={() => {
              setShowProject(!showProject)
              setIsActive(!isActive)
            }}
            className={
              isActive ? `sidebar__a sidebar__a--active` : `sidebar__a`
            }
          >
            <span className="sidebar__a--span">
              <FontAwesomeIcon icon={faStore} className="sidebar__icons" />
              Project Management
            </span>
            <FontAwesomeIcon
              icon={faCircleChevronRight}
              className="sidebar__icons--chevron"
            />
          </a>
          {showProject && (
            <ul className="sidebar__li--ul">
              <li className="sidebar__li--li">
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    navigate(Routes.SearchProjectSummary)
                    setIsActive(!isActive)
                  }}
                  className="sidebar__li--a"
                >
                  <span className="sidebar__a--span">Project Summary</span>
                </a>
              </li>
            </ul>
          )}
        </li>
        <li className="sidebar__li">
          <a
            href="javascript:void(0)"
            onClick={() => {
              navigate(Routes.WST)
              setIsActive(!isActive)
            }}
            className={
              isActive ? `sidebar__a sidebar__a--active` : `sidebar__a`
            }
          >
            <span className="sidebar__a--span">
              <FontAwesomeIcon
                icon={faChartColumn}
                className="sidebar__icons"
              />
              WST Defaulters
            </span>
          </a>
        </li>

        <li className="sidebar__li">
          <a
            onClick={() => {
              setShowUser(!showUser)
              setIsActive(!isActive)
            }}
            className={
              isActive ? `sidebar__a sidebar__a--active` : `sidebar__a`
            }
          >
            <span className="sidebar__a--span">
              <FontAwesomeIcon icon={faUsers} className="sidebar__icons" />
              User Management
            </span>
            <FontAwesomeIcon
              icon={faCircleChevronRight}
              className="sidebar__icons--chevron"
            />
          </a>
          {showUser && (
            <ul className="sidebar__li--ul">
              <li className="sidebar__li--li">
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    navigate(Routes.UserM)
                    setIsActive(!isActive)
                  }}
                  className="sidebar__li--a"
                >
                  <span className="sidebar__a--span">Users</span>
                </a>
              </li>
              <li className="sidebar__li--li">
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    navigate(Routes.Roles)
                    setIsActive(!isActive)
                  }}
                  className="sidebar__li--a"
                >
                  <span className="sidebar__a--span">Roles</span>
                </a>
              </li>
            </ul>
          )}
        </li>
      </ul> */}

            {/* <div className="mb-2 sidebar__title">Knowledge XPerience</div> */}
            {/* <ul className="sidebar__ul">
        <li className="sidebar__li">
          <a
            href="javascript:void(0)"
            className={
              isActive ? `sidebar__a sidebar__a--active` : `sidebar__a`
            }
            onClick={() => {
              navigate(Routes.KMDashboard)
              setIsActive(!isActive)
            }}
          >
            <span className="sidebar__a--span">
              <FontAwesomeIcon
                icon={faHouseChimneyWindow}
                className="sidebar__icons"
              />
              KM Dashboard
            </span>
          </a>
        </li>
        <li className="sidebar__li">
          <a
            href="javascript:void(0)"
            className={
              isActive ? `sidebar__a sidebar__a--active` : `sidebar__a`
            }
            onClick={() => {
              navigate(Routes.KMArticles)
              setIsActive(!isActive)
            }}
          >
            <span className="sidebar__a--span">
              <FontAwesomeIcon
                icon={faHouseChimneyWindow}
                className="sidebar__icons"
              />
              KM Articles
            </span>
          </a>
        </li>
        <li className="sidebar__li">
          <a
            href="javascript:void(0)"
            className={
              isActive ? `sidebar__a sidebar__a--active` : `sidebar__a`
            }
            onClick={() => {
              navigate(Routes.KMUnpublished)
              setIsActive(!isActive)
            }}
          >
            <span className="sidebar__a--span">
              <FontAwesomeIcon
                icon={faHouseChimneyWindow}
                className="sidebar__icons"
              />
              KM Approvel
            </span>
          </a>
        </li>
        <li className="sidebar__li">
          <a
            href="javascript:void(0)"
            className={
              isActive
                ? `sidebar__a sidebar__a--active`
                : `sidebar__a sidebar__a--active`
            }
            onClick={() => {
              navigate(Routes.ChatGPT)
              setIsActive(!isActive)
            }}
          >
            <span className="sidebar__a--span">
              <FontAwesomeIcon
                icon={faHouseChimneyWindow}
                className="sidebar__icons"
              />
              ChatGPT
            </span>
          </a>
        </li>
      </ul> */}

            <div
              className={
                !state.collapse
                  ? "lg:hidden sidebar__links"
                  : "sidebar__links hidden"
              }
            >
              <label
                href="#"
                style={{ cursor: "pointer" }}
                className="sidebar__links--a"
              >
                About
              </label>
              <label
                href="#"
                style={{ cursor: "pointer" }}
                className="sidebar__links--a"
              >
                Privacy & Policy
              </label>
              <label
                href="#"
                style={{ cursor: "pointer" }}
                className="sidebar__links--a"
              >
                Contact
              </label>
            </div>
          </div>
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(Sidebar);
