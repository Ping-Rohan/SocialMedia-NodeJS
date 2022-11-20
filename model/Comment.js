const mongoose = require('mongoose');

// Comment Schema
const CommentSchema = mongoose.Schema(
    {
        comment: {
            type: String,
            required: [true, 'Comment cant be empty'],
            trim: true,
        },
        post: {
            type: mongoose.Schema.ObjectId,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            required: true,
        },
        likedBy: [
            {
                type: mongoose.Schema.ObjectId,
            },
        ],
    },
    { timestamps: true }
);

// Comment Model
const Comment = mongoose.model('Comment', CommentSchema);

// Exporting
module.exports = Comment;
