module.exports = (fn) => {
    return function (request, response, next) {
        fn(request, response, next).catch(next);
    };
};
