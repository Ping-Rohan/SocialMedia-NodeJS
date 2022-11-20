const multer = require('multer');
const AppError = require('./AppError');

const memoryStorage = multer.memoryStorage();

const filterFile = (request, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Only Image Type Is Accepted'));
    }
};

const upload = multer({
    storage: memoryStorage,
    fileFilter: filterFile,
});

module.exports = upload;
