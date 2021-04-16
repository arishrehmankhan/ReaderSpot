const User = require("../models/User");
const Article = require("../models/Article");
const readingTime = require("reading-time");
const apiResponse = require("../helpers/apiResponse");
const { articleValidation } = require("../helpers/validation");

// only to test if verifyToken middleware is working
const saveArticle = async (req, res) => {
    
    // Validate article
    const validationError = articleValidation(req.body.article);

    if (validationError) {
        return apiResponse.validationErrorWithData(res, "Validation error!", validationError);
    }

    // calculate reading time
    // res.body.text is the editorJs data object, so we have to convert it to string
    // for calculating reading time and storing it in MongoDB.
    const readTimeText = readingTime(JSON.stringify(req.body.article.text)).text;

    const article = new Article({
        title: req.body.article.title,
        text: JSON.stringify(req.body.article.text),
        readTime: readTimeText
    });

    if (req.body.action == "save") {
        // save article
        article.status = "draft"

        try {
            const savedArticle = await article.save();
            apiResponse.successResponseWithData(res, "Article saved.", {article_id: savedArticle._id});
        } catch (err) {
            apiResponse.errorResponse(res, err);
        }

    } else {
        // submit article for verification
        try {
            const savedArticle = await article.save();
            apiResponse.successResponseWithData(res, "Article submitted for verification.", {article_id: savedArticle._id});
        } catch (err) {
            apiResponse.errorResponse(res, err);
        }
    }
}

module.exports.saveArticle = saveArticle;