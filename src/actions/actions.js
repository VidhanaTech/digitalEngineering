export const addUser = (user) => ({
  type: "USER",
  user,
});

export const addRoles = (roles) => ({
  type: "ROLES",
  roles,
});

export const collapseIcon = (collapse) => ({
  type: "COLLAPSE",
  collapse,
});

export const defaultPage = (defaultpage) => ({
  type: "DEFAULTPAGE",
  defaultpage,
});

export const isAdmin = (isAdmin) => ({
  type: "ISADMIN",
  isAdmin,
});

export const leveDetails = (levels) => ({
  type: "LEVELS",
  levels,
});

export const rewardPoints = (rewards) => ({
  type: "REWARDS",
  rewards,
});

export const showSideBar = (showSideBar) => ({
  type: "SIDEBARSHOW",
  showSideBar,
});

export const approveReview = (approveReview) => ({
  type: "APPROVEREVIEW",
  approveReview,
});
