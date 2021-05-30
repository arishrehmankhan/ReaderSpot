import React, { useContext, useEffect } from "react";
import TitleInput from "./TitleInput";
import ArticleButtons from "./ArticleButtons";
import Editor from "./Editor";
import { ArticleContext } from "../contexts/ArticleContext";
import Tags from "./Tags";
import { UserContext } from "../contexts/UserContext";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import ArticleHeaderImage from "./ArticleHeaderImage";

function ArticleCreate() {

  const [article, setArticle] = useContext(ArticleContext);

  const [user,] = useContext(UserContext);

  const history = useHistory();

  // reinitialize state to clear previous data
  // previous data need to be cleared as edit article is using the same context
  useEffect(() => {
    setArticle({
      title: "",
      text: "",
      tags: [],
      headerImage: process.env.REACT_APP_BASE_URL_SERVER + "/uploads/images/article_headers/default.png"
    });
  }, []);

  if (!user.isUserLoggedIn) {
    toast.warning("Please login to write a article.");
    history.push("/login");
  }

  return (
    <div id="editor">
      <Tags />
      <ArticleButtons edit={false} />
      <ArticleHeaderImage />
      <TitleInput />
      <Editor />
    </div>
  );
}

export default ArticleCreate;
