const jwt = require("jsonwebtoken");
const apiResponse = require("../helpers/apiResponse");
const { adminLoginValidation } = require("../helpers/validation");
const Article = require("../models/Article.js");
const ContactMessage = require("../models/ContactMessage");

const login = (req, res) => {
  // Validate data
  const validationError = adminLoginValidation(req.body);

  if (validationError) {
    return apiResponse.validationErrorWithData(
      res,
      "Validation error!",
      validationError
    );
  }

  const { username, password } = req.body;

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return apiResponse.validationErrorWithData(
      res,
      "Validation error!",
      "Username or password is wrong!"
    );
  }

  // create token
  const token = jwt.sign({ _id: "admin" }, process.env.TOKEN_SECRET);
  res.header("auth-token", token);

  apiResponse.successResponseWithData(res, "You are now logged in.", {
    token: token,
  });
};

const dashboard = async (req, res) => {
  try {
    const totalPublished = await Article.find({
      status: { $in: ["verified", "hidden"] },
    }).countDocuments();
    const toBeVerified = await Article.find({
      status: "to_be_verified",
    }).countDocuments();
    const totalMessages = await ContactMessage.find({}).countDocuments();
    const totalReportedArticles = await Article.find({
      reports: { $exists: true, $ne: [] },
    }).countDocuments();

    const response = {
      totalPublished,
      toBeVerified,
      totalMessages,
      totalReportedArticles,
    };

    apiResponse.successResponseWithData(res, "Success", response);
  } catch (err) {
    console.log(err);
    apiResponse.errorResponse(res, err);
  }
};

const publishedArticles = async (req, res) => {
  try {
    const published_articles = await Article.find({
      status: { $in: ["verified", "hidden"] },
    }).select("id publishDate title status");

    apiResponse.successResponseWithData(res, "Success", published_articles);
  } catch (err) {
    console.log(err);
    apiResponse.errorResponse(res, err);
  }
};

const toBeVerifiedArticles = async (req, res) => {
  try {
    const to_be_verified_articles = await Article.find({
      status: "to_be_verified",
    }).select("_id title submissionDate");

    apiResponse.successResponseWithData(
      res,
      "Success",
      to_be_verified_articles
    );
  } catch (err) {
    console.log(err);
    apiResponse.errorResponse(res, err);
  }
};

const changeArticleStatus = async (req, res) => {
  const articleId = req.body.articleId;
  const newStatus = req.body.newStatus;
  try {
    const modified = await Article.updateOne(
      { _id: articleId },
      { status: newStatus }
    );
    if (modified.n == 1) {
      apiResponse.successResponse(res, "Status changed");
    } else {
      apiResponse.errorResponse(res, "Some error occurred");
    }
  } catch (err) {
    console.log(err);
    apiResponse.errorResponse(res, err);
  }
};

const deleteArticle = async (req, res) => {
  const articleId = req.body.articleId;
  try {
    const deleted = await Article.deleteOne({ _id: articleId });
    if (deleted.n == 1) {
      apiResponse.successResponse(res, "Article deleted");
    } else {
      apiResponse.errorResponse(res, "Some error occurred");
    }
  } catch (err) {
    console.log(err);
    apiResponse.errorResponse(res, err);
  }
};

const contactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).select(
      "name email message createdAt"
    );

    apiResponse.successResponseWithData(res, "Success", messages);
  } catch (err) {
    console.log(err);
    apiResponse.errorResponse(res, err);
  }
};

const reports = async (req, res) => {
  try {
    const reports = await Article.find({
      reports: { $exists: true, $ne: [] },
    }).select("id title reports");
    if (reports) {
      apiResponse.successResponseWithData(res, "Reports Found", reports);
    } else {
      apiResponse.successResponse(res, "Reports not found");
    }
  } catch (err) {
    console.log(err);
    apiResponse.errorResponse(res, err);
  }
};

const deleteContactMessage = async (req, res) => {
  const messageId = req.body.messageId;
  try {
    const deleted = await ContactMessage.deleteOne({ _id: messageId });
    if (deleted.n == 1) {
      apiResponse.successResponse(res, "Message deleted");
    } else {
      apiResponse.errorResponse(res, "Some error occurred");
    }
  } catch (err) {
    console.log(err);
    apiResponse.errorResponse(res, err);
  }
};

module.exports.login = login;
module.exports.dashboard = dashboard;
module.exports.publishedArticles = publishedArticles;
module.exports.toBeVerifiedArticles = toBeVerifiedArticles;
module.exports.changeArticleStatus = changeArticleStatus;
module.exports.deleteArticle = deleteArticle;
module.exports.contactMessages = contactMessages;
module.exports.reports = reports;
module.exports.deleteContactMessage = deleteContactMessage;
