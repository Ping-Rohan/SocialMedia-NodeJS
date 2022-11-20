const sharp = require('sharp');
const Post = require('../model/Post');
const catchAsync = require('../utility/catchAsync');
const LikesAPI = require('../utility/likesAPI');

// Create New Post
exports.createPost = catchAsync(async (request, response, next) => {
    // Checking If Image Was Uploaded
    if (request.files) {
        request.body.photos = [];
        await Promise.all(
            request.files.map(async (file, index) => {
                file.filename = `post-${request.user.id}-${Date.now()}-${index}.jpeg`;
                await sharp(file.buffer)
                    .jpeg({ quality: 70 })
                    .toFile(`public/post/${file.filename}`);

                request.body.photos.push(file.filename);
            })
        );
    }
    request.body.user = request.user.id;
    const post = await Post.create(request.body);

    response.status(200).json({
        post,
    });
});

// Get All Post Of Particular User
exports.getAllPostOfUser = catchAsync(async (request, response, next) => {
    const posts = await Post.find({ user: request.params.id })
        .select('-user -reportedBy')
        .sort('-createdAt');
    response.status(200).json({
        posts,
    });
});

// Delete Post
exports.deletePost = catchAsync(async (request, response, next) => {
    await findByIdAndDelete({ _id: request.params.id, user: request.user.id });
    response.status(200).json({
        message: 'Post Deleted Successfully',
    });
});

// Update Post
exports.updatePost = catchAsync(async (request, response, next) => {
    // Filtering Body
    const filerOptions = ['likedBy', 'reportedBy'];
    if (request.body.likedBy || request.body.reportedBy)
        filerOptions.forEach((el) => delete request.body[el]);
    console.log(request.body);
    await Post.findByIdAndUpdate({ _id: request.params.id, user: request.user.id }, request.body);

    response.status(200).json({
        message: 'Updated Successfully',
    });
});

// Discover Post
exports.discoverPost = catchAsync(async (request, response, next) => {
    const friendsArr = [...request.user.following];
    const Posts = await Post.aggregate([
        { $match: { user: { $in: friendsArr } } },
        { $sample: { size: 10 } },
    ]);

    response.status(200).json({
        Posts,
    });
});

// Toggles Likes
exports.toggleLike = catchAsync(async (request, response, next) => {
    // Likes Counter Constructor
    const likesApi = new LikesAPI(Post, request);
    // Toggle Like And Count Numbers
    const totalLikes = await likesApi.countLikes();
    response.status(200).json({
        totalLikes,
    });
});

// Report Post
exports.reportPost = catchAsync(async (request, response, next) => {
    await Post.findByIdAndUpdate(
        { _id: request.params.id },
        {
            $addToSet: { reportedBy: request.user.id },
        }
    );

    response.status(200).json({
        message: 'Successfully Reported',
    });
});
