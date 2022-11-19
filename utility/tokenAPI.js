const AppError = require('./AppError');

class TokenApi {
    constructor(model, decoded, next) {
        this.model = model;
        this.decoded = decoded;
        this.next = next;
    }

    async #doUserStillExist() {
        // Checking User Document In DB
        const document = await this.model.findById(this.decoded.id);
        if (!document) return this.next(new AppError('User No Longer Exist'));

        return document;
    }

    async changedPasswordRecently() {
        const document = await this.#doUserStillExist();
        if (document.hasChangedPasswordRecently(this.decoded.iat))
            return this.next(new AppError('Please Login With New Password'));

        return document;
    }
}

module.exports = TokenApi;
