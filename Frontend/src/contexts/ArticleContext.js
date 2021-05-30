import React, { createContext, useState } from "react";

export const ArticleContext = createContext();

export const ArticleProvider = (props) => {

    const [article, setArticle] = useState({
        title: "",
        text: "",
        tags: [],
        headerImage: process.env.REACT_APP_BASE_URL_SERVER + "/uploads/images/article_headers/default.png"
    });

    return (
        <ArticleContext.Provider value={[article, setArticle]}>
            {props.children}
        </ArticleContext.Provider>
    );
}