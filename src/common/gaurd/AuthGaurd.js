import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

const AuthGuard = ({ component, path, user, roles, isAdmin }) => {
  const [status, setStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      try {
        if (isAdmin) setStatus(true);
        else {
          let findRole = roles.find((role) => role.Path === path);
          if (Object.keys(user).length === 0 || findRole === undefined) {
            navigate(`/`);
          } else {
            setStatus(true);
          }
        }
      } catch (error) {
        navigate(`/`);
      }
    };

    checkToken();
  }, [path, navigate, user, roles]);

  return status ? (
    <React.Fragment>{component}</React.Fragment>
  ) : (
    <React.Fragment></React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  roles: state.roles,
  isAdmin: state.isAdmin,
});

export default connect(mapStateToProps)(AuthGuard);
