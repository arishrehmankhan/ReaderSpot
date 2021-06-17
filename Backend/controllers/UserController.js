const User = require("../models/User");
const Article = require("../models/Article");
const ContactMessage = require("../models/ContactMessage");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {registerValidation, loginValidation, contactMessageValidation, updateProfileValidation} = require("../helpers/validation");
const apiResponse = require("../helpers/apiResponse");

const register = async (req, res) => {

    // Validate data
    const validationError = registerValidation(req.body);

    if (validationError) {
        return apiResponse.validationErrorWithData(res, "Validation error!", validationError);
    }

    // if user already exists
    const emailExists = await User.findOne({email: req.body.email});

    if (emailExists) {
        return apiResponse.validationErrorWithData(res, "Email Already exists.", {});
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        // save user and return response with user id
        const savedUser = await user.save();
        apiResponse.successResponseWithData(res, "Registration successful.", {user_id: savedUser._id}); 
    } catch (err) {
        apiResponse.errorResponse(res, err);
    }

}

const login = async (req, res) => {

    // Validate data
    const validationError = loginValidation(req.body);

    if (validationError) {
        return apiResponse.validationErrorWithData(res, "Validation error!", validationError);
    }

    // check if user exists
    const user = await User.findOne({email: req.body.email});

    if (!user) {
        return apiResponse.validationErrorWithData(res, "Validation error!", "Email or password is wrong!");
    }

    // check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);

    if (!validPass) {
        return apiResponse.validationErrorWithData(res, "Validation error!", "Email or password is wrong!");
    }

    // create token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header("auth-token", token)
    
    const userDetails = {
        id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        bio: user.bio
    }

    // remove password from user object before sending response
    user["password"] = null;

    apiResponse.successResponseWithData(res, "Login successful.", {user: userDetails, token: token});
}

const updateProfile = async (req, res) => {

    // Validate data
    const validationError = updateProfileValidation(req.body);

    if (validationError) {
        return apiResponse.validationErrorWithData(res, "Validation error!", validationError);
    }

    const userId = req.userId;
    const name = req.body.name;
    const email = req.body.email;
    const bio = req.body.bio;

    try {
        const result = await User.updateOne({_id: userId}, {name, email, bio});
        if (result.nModified == 1) {
            apiResponse.successResponse(res, "Profile Updated");
        } else {
            apiResponse.successResponse(res, "Something went wrong!");
        }
    } catch (err) {
        apiResponse.errorResponse(res, err);
    }
}

const contactMessage = async (req, res) => {

    // Validate data
    const validationError = contactMessageValidation(req.body);

    if (validationError) {
        return apiResponse.validationErrorWithData(res, "Validation error!", validationError);
    }

    const contactMessage = ContactMessage({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    });

    try {
        await contactMessage.save();
        apiResponse.successResponse(res, "Thanks, We will contact you soon.");
    } catch (err) {
        apiResponse.errorResponse(res, err);
    }
}

const profile = async (req, res) => {
    const userId = req.params.userId;
    try {
        const profile = await User.findOne({_id: userId}).select("name email bio pic createdAt");
        if (profile)
            apiResponse.successResponseWithData(res, "Profile Found", profile);
        else
            apiResponse.successResponse(res, "Profile not found");
    } catch (err) {
        apiResponse.errorResponse(res, err);
    }
}

const publishedArticles = async (req, res) => {
    const userId = req.params.userId;
    try {
        const articles = await Article
        .find({author: userId, status: "verified"})
        .select('_id title tags headerImage publishDate')
        .sort({ submissionDate: -1 })
        .populate('author', '_id name pic');
        if (articles)
            apiResponse.successResponseWithData(res, "Articles found", {articles});
        else
            apiResponse.successResponse(res, "Articles not found");
    } catch (err) {
        apiResponse.errorResponse(res, err);
    }
}

module.exports.register = register;
module.exports.login = login;
module.exports.updateProfile = updateProfile;
module.exports.contactMessage = contactMessage;
module.exports.profile = profile;
module.exports.publishedArticles = publishedArticles;