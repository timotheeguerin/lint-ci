var Api = function () {
};

Api.root = '/api/v1';

Api.get = function (url, data) {
    return Rest.get(Api.root + url, data)
};

Api.post = function (url, data) {
    return Rest.post(Api.root + url, data)
};
