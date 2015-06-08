var Rest = function () {
};
Rest.get = function (url, data) {
    return Rest.request("GET", url, data)
};

Rest.post = function (url, data) {
    return Rest.request("POST", url, data)
};

Rest.request = function (method, url, data) {
    return $.ajax({
        type: method,
        url: url,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data)
    })
};
