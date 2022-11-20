class LikeApi {
    constructor(model, request) {
        this.model = model;
        this.request = request;
    }
    // Toggles Likes
    async toggleLike() {
        const document = await this.model.findOne({
            _id: this.request.params.id,
            likedBy: this.request.user.id,
        });
        // Checking if Already Liked Or Not
        if (!document) {
            return await this.model.findByIdAndUpdate(
                { _id: this.request.params.id },
                { $push: { likedBy: this.request.user.id } },
                { new: true }
            );
        } else {
            return await this.model.findByIdAndUpdate(
                { _id: this.request.params.id },
                { $pull: { likedBy: this.request.user.id } },
                { new: true }
            );
        }
    }
    // Counting Total Numbers Of Likes
    async countLikes() {
        const likedDocument = await this.toggleLike();
        return likedDocument.likedBy.length;
    }
}

module.exports = LikeApi;
