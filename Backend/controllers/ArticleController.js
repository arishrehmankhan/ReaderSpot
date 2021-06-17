const User = require("../models/User");
const Article = require("../models/Article");
const readingTime = require("reading-time");
const apiResponse = require("../helpers/apiResponse");
const { articleValidation, validateLikeData, validateCommentData, validateReportData } = require("../helpers/validation");
const jwt = require("jsonwebtoken");

const save = async (req, res) => {

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
        text: req.body.article.text,
        readTime: readTimeText,
        tags: req.body.article.tags,
        headerImage: req.body.article.headerImage,
        author: req.userId
    });

    if (req.body.action == "save") {
        // save article
        article.status = "draft"

        try {
            const savedArticle = await article.save();
            apiResponse.successResponseWithData(res, "Article saved.", { article_id: savedArticle._id });
        } catch (err) {
            apiResponse.errorResponse(res, err);
        }

    } else {
        // submit article for verification
        try {
            const savedArticle = await article.save();
            apiResponse.successResponseWithData(res, "Article submitted for verification.", { article_id: savedArticle._id });
        } catch (err) {
            apiResponse.errorResponse(res, err);
        }
    }
}

const edit = async (req, res) => {

    // Validate article
    const validationError = articleValidation(req.body.article);

    if (validationError) {
        return apiResponse.validationErrorWithData(res, "Validation error!", validationError);
    }

    // calculate reading time
    // res.body.text is the editorJs data object, so we have to convert it to string
    // for calculating reading time and storing it in Database.
    const readTimeText = readingTime(JSON.stringify(req.body.article.text)).text;

    try {

        const article = await Article.findOne({ _id: req.body.articleId, author: req.userId });

        if (article) {
            article.title = req.body.article.title
            article.text = req.body.article.text,
                article.readTime = readTimeText,
                article.tags = req.body.article.tags
            article.headerImage = req.body.article.headerImage

            if (req.body.action == "save") {
                article.status = "draft";
                await article.save();
                apiResponse.successResponseWithData(res, "Article saved.", { article_id: article._id });
            } else {
                article.status = "to_be_verified";
                await article.save();
                apiResponse.successResponseWithData(res, "Article submitted for verification.", { article_id: article._id });
            }
        }

    } catch (err) {
        console.log(err);
        apiResponse.errorResponse(res, err);
    }
}

const likeUnlike = async (req, res) => {

    // Validate data
    const validationError = validateLikeData(req.body);

    if (validationError) {
        apiResponse.validationErrorWithData(res, "Validation error!", validationError);
    }

    var articleId = req.body.articleId;
    var userId = req.userId;

    try {
        var article = await Article.findOne({ '_id': articleId });
        // check if the user has already liked the article, unlike it
        if (article.likes.includes(userId)) {
            // remove the userId from like array
            article.likes = article.likes.filter(item => item != userId);
        } else {
            article.likes.push(userId);
        }

        const { likes } = await article.save();

        apiResponse.successResponseWithData(res, "Article Liked", { likes: likes });

    } catch (err) {
        apiResponse.errorResponse(res, err);
        console.log(err);
    }



}

const getOne = async (req, res) => {

    const articleId = req.params.id;

    const token = req.header('auth-token');

    var userId = null;

    if (token) {

        try {
            const { _id } = jwt.verify(token, process.env.TOKEN_SECRET);
            userId = _id;
        } catch (err) {
            console.log(err);
        }

    }

    try {
        var article = await Article
            .findOne({ _id: articleId })
            .populate('author', '_id name pic')
            .populate('comments.postedBy', '_id name pic')
            .lean();

        // increment viewCounter
        await Article.updateOne({ _id: articleId }, { $inc: { 'viewCounter': 1 } });

        if (article == null) {
            apiResponse.successResponse(res, "Article not found");
        } else {

            var isBookmarked = false;

            if (userId) {
                const { bookmarks } = await User.findOne({ "_id": userId }).select("bookmarks");
                if (bookmarks.includes(article._id))
                    isBookmarked = true;
            }

            article.isBookmarked = isBookmarked;

            apiResponse.successResponseWithData(res, "Article found", article);
        }
    } catch (err) {
        apiResponse.errorResponse(res, err);
        console.log(err);
    }

}

const comment = async (req, res) => {

    // Validate data
    const validationError = validateCommentData(req.body);

    if (validationError) {
        apiResponse.validationErrorWithData(res, "Validation error!", validationError);
    }

    // incomming datas
    var articleId = req.body.articleId;
    var userId = req.userId;
    var comment = req.body.comment;

    try {
        var article = await Article.findOne({ _id: articleId });

        article.comments.push({
            comment: comment,
            postedBy: userId
        });
        const { comments } = await article.save();

        apiResponse.successResponseWithData(res, "Comment successful", { lastComment: comments[comments.length - 1] });
    } catch (err) {
        apiResponse.errorResponse(res, err);
        console.log(err);
    }

}

const report = async (req, res) => {

    // Validate data
    const validationError = validateReportData(req.body);

    if (validationError) {
        apiResponse.validationErrorWithData(res, "Validation error!", validationError);
    }

    const articleId = req.body.articleId;
    const userId = req.userId;
    const message = req.body.message;

    try {
        var article = await Article.findOne({_id: articleId});
        
        if (article.reports.find((report) => report.reportedBy == userId)) {
            apiResponse.successResponse(res, "Your report is already submitted");
        } else {
            article.reports.push({
                reportedBy: userId,
                message: message
            })
            await article.save();
            apiResponse.successResponse(res, "Your report is submitted");
        }

    } catch (err) {
        apiResponse.errorResponse(res, err);
    }

}

const getRecent = async (req, res) => {

    try {
        const articles = await Article.find({ status: "verified" })
            .select('_id title tags readTime headerImage publishDate')
            .sort({ publishDate: -1 })
            .limit(15)
            .populate('author', '_id name pic')
        if (articles.length == 0) {
            apiResponse.successResponse(res, "Articles not found");
        } else {
            apiResponse.successResponseWithData(res, "Articles found", { articles });
        }
    } catch (err) {
        apiResponse.errorResponse(res, err);
        console.log(err);
    }

}

const saved = async (req, res) => {

    const userId = req.userId;

    try {
        const articles = await Article
            .find({ author: userId, status: "draft" })
            .select('_id title tags readTime headerImage publishDate')
            .sort({ submissionDate: -1 })
            .populate('author', '_id name pic');
        if (articles.length == 0) {
            apiResponse.successResponse(res, "Articles not found");
        } else {
            apiResponse.successResponseWithData(res, "Articles found", { articles });
        }
    } catch (err) {
        apiResponse.errorResponse(res, err);
        console.log(err);
    }

}

const ofUser = async (req, res) => {

    const userId = req.userId;

    try {
        const articles = await Article
            .find({ author: userId, status: { $in: ["to_be_verified", "verified"] } })
            .select('_id title tags readTime headerImage status publishDate')
            .sort({ submissionDate: -1 })
            .populate('author', '_id name pic');
        if (articles.length == 0) {
            apiResponse.successResponse(res, "Articles not found");
        } else {
            apiResponse.successResponseWithData(res, "Articles found", { articles });
        }
    } catch (err) {
        apiResponse.errorResponse(res, err);
        console.log(err);
    }

}

const deleteOne = async (req, res) => {
    const articleId = req.params.id;
    const userId = req.userId;

    try {
        const deleted = await Article.deleteOne({ _id: articleId, author: userId });
        if (deleted.n == 1) {
            apiResponse.successResponse(res, "Article deleted");
        } else {
            apiResponse.errorResponse(res, "Something went wrong");
        }

    } catch (err) {
        apiResponse.errorResponse(res, err);
        console.log(err);
    }
}

const bookmark = async (req, res) => {
    const articleId = req.body.articleId;
    const userId = req.userId;

    try {
        const article = await Article.findOne({ _id: articleId });
        if (article) {
            var user = await User.findOne({ _id: userId });

            if (user.bookmarks.includes(article._id)) {
                user.bookmarks = user.bookmarks.filter(item => item != articleId);
                user.save();
                apiResponse.successResponse(res, "Bookmark Removed");
            } else {
                user.bookmarks.push(article._id);
                user.save();
                apiResponse.successResponse(res, "Bookmarked");
            }
        } else {
            apiResponse.errorResponse(res, "Something went wrong");
        }

    } catch (err) {
        apiResponse.errorResponse(res, err);
        console.log(err);
    }
}

const bookmarked = async (req, res) => {
    const userId = req.userId;

    try {

        const { bookmarks } = await User.findOne({ _id: userId });
        const articles = await Article
            .find({ _id: { $in: bookmarks } })
            .select('_id title tags readTime headerImage status publishDate')
            .sort({ publishDate: -1 })
            .populate('author', '_id name pic');

        if (articles.length == 0) {
            apiResponse.successResponse(res, "Articles not found");
        } else {
            apiResponse.successResponseWithData(res, "Articles found", { articles });
        }

    } catch (err) {
        apiResponse.errorResponse(res, err);
        console.log(err);
    }

}

const trending = async (req, res) => {
    try {
        const articles = await Article.find({ status: "verified" })
            .select('_id title tags readTime headerImage publishDate')
            .sort({ viewCounter: -1 })
            .limit(6)
            .populate('author', '_id name pic')
        if (articles.length == 0) {
            apiResponse.successResponse(res, "Articles not found");
        } else {
            apiResponse.successResponseWithData(res, "Articles found", { articles });
        }
    } catch (err) {
        apiResponse.errorResponse(res, err);
        console.log(err);
    }
}

module.exports.save = save;
module.exports.likeUnlike = likeUnlike;
module.exports.comment = comment;
module.exports.report = report;
module.exports.getOne = getOne;
module.exports.getRecent = getRecent;
module.exports.saved = saved;
module.exports.edit = edit;
module.exports.ofUser = ofUser;
module.exports.deleteOne = deleteOne;
module.exports.bookmark = bookmark;
module.exports.bookmarked = bookmarked;
module.exports.trending = trending;

