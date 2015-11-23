var Rest = function () {
};
Rest.get = function (url, data) {
    return Rest.request("GET", url, data)
};

Rest.post = function (url, data) {
    return Rest.request("POST", url, data)
};

Rest.request = function (method, url, data) {
    // Temporary hack to allow cloudflare flexible SSL
    if (window.location.protocol == 'https') {
        url.replace('http://', 'https://');
    }
    return $.ajax({
            type: method,
            url: url,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(data)
        }
    ).fail(function (jqXHR, textStatus, errorThrown) {
        console.error('Fail to load url: ', this.url);
        console.error(jqXHR, textStatus, errorThrown);
    })
};
