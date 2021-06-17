import React, { useContext, useEffect, useState } from "react"
import { UserContext } from "../contexts/UserContext";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../helpers/api";
import ArticleList from "./ArticleList";

const SavedArticles = () => {

    const [ user, ] = useContext(UserContext);

    const [savedArticles, setSavedArticles] = useState();
  
    const history = useHistory();
  
    if (!user.isUserLoggedIn) {
      toast.warning("Please login to see your saved articles.");
      history.push("/login");
    }

    useEffect(() => {
        getArticles();
    }, []);

    const getArticles = async () => {
        const res = await api.get(`/article/saved`, { headers: { "auth-token": user.user_token }});
        if (res.data.status === 1 && res.data.data)
            setSavedArticles(res.data.data.articles);
        console.log(res);
    };

    const deleteArticleFromArray = (articleId) => {
        const articles = savedArticles.filter((article) => {
            return article._id !== articleId
        });
        setSavedArticles(articles)
    }

    return (
        <div>
        {
            savedArticles ? 
            <div>
                <h2>Your Saved Articles</h2>
                <ArticleList articles={savedArticles} deleteArticleFromArray={deleteArticleFromArray} />
            </div>
            : 
            <h2>You do not have any saved articles</h2>
        }
        </div>
    )
}

export default SavedArticles
