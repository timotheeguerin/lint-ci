class Rest {
    static get(url, data) {
        return Rest.request("GET", url, data)
    }

    static post(url, data) {
        return Rest.request("POST", url, data)
    };

    static delete(url, data) {
        return Rest.request("DELETE", url, data)
    };

    static request(method, url, data) {
        if (!url) {
            console.error(`Url cannot be undefined`);
            return;
        }
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

}
