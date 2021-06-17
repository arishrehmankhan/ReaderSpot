import React, { useEffect, useContext, useState } from "react";
import api from "../helpers/api";
import { UserContext } from "../contexts/UserContext";
import Moment from "react-moment";
import { toast } from "react-toastify";
import { MDBDataTable } from "mdbreact";
import Modal from "react-modal";

const AdminToBeVerifiedArticles = () => {

  const [user] = useContext(UserContext);
  const [toBeVerifiedArticles, setToBeVerifiedArticles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // for table
  const data = {
    columns: [
      {
        label: "Submission DateTime",
        field: "submissionDate",
        sort: "desc",
        width: 100,
      },
      {
        label: "Title",
        field: "title",
        sort: "asc",
        width: 500,
      },
      {
        label: "Actions",
        field: "actions",
        width: 50,
      },
    ],
    rows: toBeVerifiedArticles,
  };

  useEffect(() => {
    getToBeVerifiedArticles();
  }, []);

  const getToBeVerifiedArticles = async () => {
    const res = await api.get(`/admin/to-be-verified-articles`, {
      headers: { "auth-token": user.admin_token },
    });
    if (res.data.status === 1) {
      // modify data to display in table
      var articles = res.data.data.map((article) => {
        return {
          _id: article._id,
          title: article.title,
          submissionDate: (
            <Moment format="MMM DD, YYYY hh:mm a" date={article.publishDate} />
          ),
          clickEvent: () => openArticle(article._id),
          actions: (
            <div>
              <button
                onClick={(e) => publishArticle(e, article._id)}
                className="btn btn-primary btn-sm rounded-0 hide-show-btn"
                type="button"
                title="Open"
              >
                Publish
              </button>
              <button
                onClick={(e) => openModal(e, article._id)}
                className="btn btn-danger btn-sm rounded-0"
                type="button"
                title="Open"
              >
                Delete
              </button>
            </div>
          ),
        };
      });
      setToBeVerifiedArticles(articles);
    }
  };

  const openArticle = (articleId) => {
    window.open(process.env.REACT_APP_SITE_URL + `/article/${articleId}`);
  };

  const publishArticle = async (e, articleId) => {
    e.stopPropagation();
    const body = {
      articleId: articleId,
      newStatus: "verified",
    };
    const res = await api.post(`/admin/change-article-status`, body, {
      headers: { "auth-token": user.admin_token },
    });
    if (res.data.status === 1) {
      toast.success(res.data.message);
      getToBeVerifiedArticles();
    } else {
      toast.warning("Some error occurred");
    }
  };

  const openModal = (e, articleId) => {
    e.stopPropagation();
    setArticleToBeDeleted(articleId);
    setIsModalOpen(true);
  };

  const deleteArticle = async (articleId) => {
    const body = {
      articleId: articleId,
    };
    const res = await api.post(`/admin/delete-article`, body, {
      headers: { "auth-token": user.admin_token },
    });
    if (res.data.status === 1) {
      toast.success(res.data.message);
      getToBeVerifiedArticles();
    } else {
      toast.warning("Some error occurred");
    }
    setIsModalOpen(false);
  };

  return (
    <div id="content-wrapper" className="d-flex flex-column">
      <div className="content">
        <div className="container-fluid">
          <div className="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 className="h3 mb-0 text-gray-800">To be verified</h1>
          </div>
          <MDBDataTable hover bordered small data={data} /><Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            style={customStyles}
            contentLabel="Modal"
            ariaHideApp={false}
          >
            <i
              onClick={() => setIsModalOpen(false)}
              className="close-btn fa fa-times"
            ></i>
            <h4 className="modal-text">Are you sure?</h4>
            <button
              onClick={() => deleteArticle(articleToBeDeleted)}
              className="btn btn-danger btn-sm rounded-0 float-right"
              type="button"
              title="Yes Delete"
            >
              Yes, Delete It
            </button>
          </Modal>
          {/* <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Title</th>
                <th scope="col">Date Submitted</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {toBeVerifiedArticles &&
                toBeVerifiedArticles.map((article) => {
                  return (
                    <tr key={article._id}>
                      <th scope="row">{article._id}</th>
                      <td>{article.title}</td>
                      <td>
                        <Moment format="MMM DD, YYYY h:m a">
                          {article.publishDate}
                        </Moment>
                      </td>
                      <td>
                        <button
                          onClick={() => openArticle(article._id)}
                          className="btn btn-primary btn-sm rounded-0"
                          type="button"
                          title="Open"
                        >
                          <i className="fa fa-eye"></i>
                        </button>
                        <button
                          onClick={() => publishArticle(article._id)}
                          className="btn btn-success btn-sm rounded-0"
                          type="button"
                          title="Publish"
                        >
                          <i className="fa fa-check-square"></i>
                        </button>
                        <button
                          onClick={() => deleteArticle(article._id)}
                          className="btn btn-danger btn-sm rounded-0"
                          type="button"
                          title="Delete"
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table> */}
        </div>
      </div>
    </div>
  );
};

export default AdminToBeVerifiedArticles;
