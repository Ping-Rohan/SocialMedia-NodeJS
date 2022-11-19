const mongoose = require('mongoose');

// Post Schema
const PostSchema = mongoose.Schema(
    {
        text: {
            type: String,
            required: [true, 'Post Cant Be Empty'],
            trim: true,
        },
        photos: [String],
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        likedBy: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
        ],
        reportedBy: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
        ],
    },
    { timestamps: true }
);

// Post Model
const Post = mongoose.model('Post', PostSchema);

// exporting
module.exports = Post;
