import React, { useEffect, useContext, useState } from "react";
import api from "../helpers/api";
import { UserContext } from "../contexts/UserContext";
import Moment from "react-moment";
import { toast } from "react-toastify";
import Modal from "react-modal";

const AdminReports = () => {
  const [user, ] = useContext(UserContext);
  const [reportedArticles, setReportedArticles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [articleToBeDeleted, setArticleToBeDeleted] = useState();

  // modal config
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  useEffect(() => {
    getReports();
  }, []);

  const getReports = async () => {
    const res = await api.get(`/admin/reports`, {
      headers: { "auth-token": user.admin_token },
    });
    if (res.data.status === 1) {
      setReportedArticles(res.data.data);
    }
  };

  const openArticle = (articleId) => {
    window.open(process.env.REACT_APP_SITE_URL + `/article/${articleId}`);
  };

  const deleteArticle = async (articleId) => {
    const body = {
      articleId: articleId,
    };
    const res = await api.post(`/admin/delete-article`, body, {
      headers: { "auth-token": user.admin_token },
    });
    if (res.data.status === 1) {
      setIsModalOpen(false);
      toast.success(res.data.message);
      var reportedArticles2 = reportedArticles.filter((reportedArticle) => reportedArticle._id !== articleId);
      setReportedArticles(reportedArticles2);
    } else {
      toast.warning("Some error occurred");
    }
  };

  const openReports = (articleId) => {
    const article = reportedArticles.filter((reportedArticle) => reportedArticle._id === articleId);
    setReports(article[0].reports);
    setIsModalOpen(true);
  }

  const openModal = (articleId) => {
    setArticleToBeDeleted(articleId);
    setIsModalOpen(true);
  }

  return (
    <div id="content-wrapper" className="d-flex flex-column">
      <div className="content">
        <div className="container-fluid">
          <div className="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 className="h3 mb-0 text-gray-800">Reported Articles</h1>
          </div>
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Article Id</th>
                <th scope="col">Title</th>
                <th scope="col">Reports Count</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {reportedArticles &&
                reportedArticles.map((reportedArticle) => {
                  return [
                    <tr key={reportedArticle._id} onClick={() => { openReports(reportedArticle._id) }}>
                      <td>{reportedArticle._id}</td>
                      <td>{reportedArticle.title}</td>
                      <td>{reportedArticle.reports.length}</td>
                      <td>
                        <button
                          onClick={() => openArticle(reportedArticle._id)}
                          className="btn btn-primary btn-sm rounded-0"
                          type="button"
                          title="Open"
                        >
                          <i className="fa fa-eye"></i>
                        </button>
                        <button
                          onClick={() => openModal(reportedArticle._id)}
                          className="btn btn-danger btn-sm rounded-0"
                          type="button"
                          title="Delete"
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>,
                  ];
                })}
            </tbody>
          </table>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            style={customStyles}
            contentLabel="Modal"
            ariaHideApp={false}
          >
            <i onClick={() => setIsModalOpen(false)} className="close-btn fa fa-times"></i>
            <table className="table">
              <thead className="thead">
                <tr>
                  <th scope="col">User Id</th>
                  <th scope="col">Message</th>
                  <th scope="col">Time</th>
                </tr>
              </thead>
              <tbody>
                {reports &&
                  reports.map((report) => {
                    return [
                      <tr key={report._id}>
                        <td>{report.reportedBy}</td>
                        <td>{report.message}</td>
                        <td><Moment fromNow>{report.time}</Moment></td>
                      </tr>,
                    ];
                  })}
              </tbody>
            </table>
            <button
              onClick={() => deleteArticle(articleToBeDeleted)}
              className="btn btn-danger btn-sm rounded-0 float-right"
              type="button"
              title="Delete"
            >
              Delete
            </button>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
