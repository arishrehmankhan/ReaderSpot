import React, { useEffect, useContext, useState } from "react";
import api from "../helpers/api";
import { UserContext } from "../contexts/UserContext";
import Moment from "react-moment";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import Modal from "react-modal";

const AdminPublishedArticles = () => {
  const [user] = useContext(UserContext);
  const [publishedArticles, setPublishedArticles] = useState([]);
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
        label: "Publish Date",
        field: "publishDate",
        sort: "desc",
        width: 150,
      },
      {
        label: "Title",
        field: "title",
        sort: "asc",
        width: 270,
      },
      {
        label: "Actions",
        field: "actions",
        width: 200,
      },
    ],
    rows: publishedArticles,
  };

  useEffect(() => {
    getPublishedArticles();
  }, []);

  const getPublishedArticles = async () => {
    const res = await api.get(`/admin/published-articles`, {
      headers: { "auth-token": user.admin_token },
    });
    if (res.data.status === 1) {
      // modify data to display in table
      var articles = res.data.data.map((article) => {
        var newStatus;
        var newStatusText;
        if (article.status === "verified") {
          newStatus = "hidden";
          newStatusText = "Hide";
        } else {
          newStatus = "verified";
          newStatusText = "Show";
        }
        return {
          _id: article._id,
          title: article.title,
          publishDate: (
            <Moment format="MMM DD, YYYY hh:mm a" date={article.publishDate} />
          ),
          clickEvent: () => openArticle(article._id),
          actions: (
            <div>
              <button
                onClick={(e) => changeStatus(e, article._id, newStatus)}
                className="btn btn-primary btn-sm rounded-0 hide-show-btn"
                type="button"
                title="Open"
              >
                {newStatusText}
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

      setPublishedArticles(articles);
      console.log(articles);
    }
  };

  const openArticle = (articleId) => {
    window.open(process.env.REACT_APP_SITE_URL + `/article/${articleId}`);
  };

  const changeStatus = async (e, articleId, newStatus) => {
    e.stopPropagation();
    const body = {
      articleId: articleId,
      newStatus: newStatus,
    };
    const res = await api.post(`/admin/change-article-status`, body, {
      headers: { "auth-token": user.admin_token },
    });
    if (res.data.status === 1) {
      toast.success(res.data.message);
      getPublishedArticles();
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
      getPublishedArticles();
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
            <h1 className="h3 mb-0 text-gray-800">Published Articles</h1>
          </div>
          <MDBDataTable hover bordered small data={data} />
          <Modal
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
        </div>
      </div>
    </div>
  );
};

export default AdminPublishedArticles;
