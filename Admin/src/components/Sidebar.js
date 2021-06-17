import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

const AdminSidebar = () => {

  const [ , setUser ] = useContext(UserContext);

  const history = useHistory();

  const logout = () => {
      setUser({
          isAdminLoggedIn: false,
          admin_token: ""
      });
      localStorage.removeItem("admin_token");
      toast.success("Logged out successfully");
      history.push("/admin/login");
  }

  return (
    <div>
      <ul
        className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        <Link
          className="sidebar-brand d-flex align-items-center justify-content-center"
          to={{ pathname: process.env.REACT_APP_SITE_URL}} target="_blank"
        >
          <div className="sidebar-brand-icon">
            <i className="fas fa-users-cog"></i>
          </div>
          <div className="sidebar-brand-text mx-3">ReaderSpot</div>
        </Link>
        <hr className="sidebar-divider my-0" />
        <li className="nav-item active">
          <Link className="nav-link" to="/admin/dashboard">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </Link>
        </li>
        <hr className="sidebar-divider" />
        <div className="sidebar-heading">Interface</div>
        <li className="nav-item">
          <Link className="nav-link" to="/admin/published-articles">
            <i className="fas fa-fw fa-scroll"></i>
            <span>Published Articles</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/admin/to-be-verified-articles">
            <i className="fas fa-fw fa-user-check"></i>
            <span>To be verified</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/admin/contact-messages">
            <i className="fas fa-fw fa-envelope"></i>
            <span>Contact Messages</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/admin/reports">
            <i className="fas fa-fw fa-flag"></i>
            <span>Reports</span>
          </Link>
        </li>
        <li className="nav-item">
          <div className="nav-link" to="/admin/reports" onClick={logout}>
            <i className="fas fa-fw fa-sign-out-alt"></i>
            <span>Logout</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
