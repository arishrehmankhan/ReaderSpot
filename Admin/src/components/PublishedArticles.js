import React, { useEffect, useContext, useState } from "react";
import api from "../helpers/api";
import { UserContext } from "../contexts/UserContext";
import Moment from "react-moment";
import { MDBDataTable } from "mdbreact";

const AdminPublishedArticles = () => {
  const [user] = useContext(UserContext);
  const [publishedArticles, setPublishedArticles] = useState([]);

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
        return {
          _id: article._id,
          title: article.title,
          publishDate: (<Moment format='MMM DD, YYYY hh:mm a' date={article.publishDate} />),
          clickEvent: () => openArticle(article._id),
          actions: (
            <button
              onClick={() => openArticle(article._id)}
              className="btn btn-primary btn-sm rounded-0"
              type="button"
              title="Open"
            >
              View
            </button>
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

  return (
    <div id="content-wrapper" className="d-flex flex-column">
      <div className="content">
        <div className="container-fluid">
          <div className="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 className="h3 mb-0 text-gray-800">Published Articles</h1>
          </div>
          <MDBDataTable hover bordered small data={data} />
        </div>
      </div>
    </div>
  );
};

export default AdminPublishedArticles;
