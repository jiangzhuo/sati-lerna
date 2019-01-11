function asyncInitializerWrap(asyncCall) {
    return function (context, callback) {
        if (asyncCall.constructor.name !== 'AsyncFunction') {
            const err = new TypeError('Must be an AsyncFunction');
            return callback(err);
        }

        asyncCall(context).then((result) => {
            callback(null, result);
        }, (err) => {
            callback(err);
        });
    };
}

function asyncHandlerWrap(asyncCall) {
    return function (event, context, callback) {
        if (asyncCall.constructor.name !== 'AsyncFunction') {
            const err = new TypeError('Must be an AsyncFunction');
            return callback(err);
        }

        asyncCall(event, context).then((result) => {
            callback(null, result);
        }, (err) => {
            callback(err);
        });
    };
}

module.exports = {
    asyncHandlerWrap,
    asyncInitializerWrap
};
