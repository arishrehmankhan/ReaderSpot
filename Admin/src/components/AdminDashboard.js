import React, { useEffect, useContext, useState } from "react";
import api from "../helpers/api";
import { UserContext } from "../contexts/UserContext";
import { useHistory } from "react-router";

const AdminDashboard = () => {

  const [user, setUser] = useContext(UserContext);
  const [totalPublished, setTotalPublished] = useState(0);
  const [toBeVerified, setToBeVerified] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalReportedArticles, setTotalReportedArticles] = useState(0);

  const history = useHistory();

  useEffect(() => {
    getDashboardData();
  }, []);

  const getDashboardData = async () => {
    const res = await api.get(`/admin/dashboard`, {
      headers: { "auth-token": user.admin_token },
    });
    if (res.data.status === 1) {
      setTotalPublished(res.data.data.totalPublished);
      setToBeVerified(res.data.data.toBeVerified);
      setTotalMessages(res.data.data.totalMessages);
      setTotalReportedArticles(res.data.data.totalReportedArticles);
    }
  };

  return (
    <div id="content-wrapper" className="d-flex flex-column">
      <div className="content">
        <div className="container-fluid">
          <div className="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
          </div>
          <div className="stats row">
            <div className="col-xl-3 col-md-6 mb-4">
              <div onClick={() => history.push("/admin/published-articles")} className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        Total Published
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {totalPublished}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-scroll fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div onClick={() => history.push("/admin/to-be-verified-articles")} className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                        To be verified
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {toBeVerified}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-user-check fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div onClick={() => history.push("/admin/contact-messages")} className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-info shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                        Messages
                      </div>
                      <div className="row no-gutters align-items-center">
                        <div className="col-auto">
                          <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                          {totalMessages}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-envelope fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div onClick={() => history.push("/admin/reports")} className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-warning shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                        Pending reports
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {totalReportedArticles}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-flag fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
