import { combineReducers } from "redux";

const user = (state = null, action) => {
  switch (action.type) {
    case "USER":
      return action.user;
    default:
      return state;
  }
};

const roles = (state = [], action) => {
  switch (action.type) {
    case "ROLES":
      return action.roles;
    default:
      return state;
  }
};

const collapse = (state = [], action) => {
  switch (action.type) {
    case "COLLAPSE":
      return action.collapse;
    default:
      return state;
  }
};

const defaultpage = (state = [], action) => {
  switch (action.type) {
    case "DEFAULTPAGE":
      return action.defaultpage;
    default:
      return state;
  }
};

const isAdmin = (state = [], action) => {
  switch (action.type) {
    case "ISADMIN":
      return action.isAdmin;
    default:
      return state;
  }
};

const levels = (state = [], action) => {
  switch (action.type) {
    case "LEVELS":
      return action.levels;
    default:
      return state;
  }
};

const rewards = (state = [], action) => {
  switch (action.type) {
    case "REWARDS":
      return action.rewards;
    default:
      return state;
  }
};

const showSideBar = (state = [], action) => {
  switch (action.type) {
    case "SIDEBARSHOW":
      return action.showSideBar;
    default:
      return state;
  }
};

const approveReview = (state = [], action) => {
  switch (action.type) {
    case "APPROVEREVIEW":
      return action.approveReview;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user,
  roles,
  collapse,
  levels,
  rewards,
  defaultpage,
  isAdmin,
  showSideBar,
  approveReview,
});

export default rootReducer;
