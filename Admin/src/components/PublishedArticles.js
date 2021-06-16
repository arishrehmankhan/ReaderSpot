import React, { useEffect, useContext, useState } from "react";
import api from "../helpers/api";
import { UserContext } from "../contexts/UserContext";
import { useHistory } from "react-router";
import Moment from "react-moment";

const AdminPublishedArticles = () => {
  const [user, setUser] = useContext(UserContext);

  const [publishedArticles, setPublishedArticles] = useState([]);

  useEffect(() => {
    getPublishedArticles();
  }, []);

  const history = useHistory();

  const getPublishedArticles = async () => {
    const res = await api.get(`/admin/published-articles`, {
      headers: { "auth-token": user.admin_token },
    });
    if (res.data.status === 1) {
      setPublishedArticles(res.data.data);
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
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Title</th>
                <th scope="col">Date Published</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {publishedArticles &&
                publishedArticles.map((article) => {
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
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPublishedArticles;
