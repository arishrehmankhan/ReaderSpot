const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        default: "unpublished"
    },
    headerImage: {
        type: String,
        default: "http://localhost:5000/uploads/images/article_headers/default.png"
    },
    readTime: {
        type: String
    },
    tags: {
        type: [String]
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    submissionDate: {
        type: Date,
        default: Date.now
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        comment: {
            type: String,
            required: true,
            max: 255,
            min: 1
        },
        time: {
            type: Date,
            default: Date.now,
        },
        postedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    }],
    reports: [{
        message: {
            type: String,
            required: true,
            max: 255,
        },
        time: {
            type: Date,
            default: Date.now,
        },
        reportedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    }],
    viewCounter: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);