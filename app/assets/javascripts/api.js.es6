//= require vendor/uri
//= require rest

class Api {
    constructor(host = '') {
        this.root = URI(host + '/api/v1');
        this.ready = false;
        this.readyCallbacks = [];
        this.loadUrls();
    }

    onLoad(callback) {
        if (this.ready) {
            callback();
        } else {
            this.readyCallbacks.push(callback);
        }
    }

    notifyLoaded() {
        this.ready = true;
        for (let item of this.readyCallbacks) {
            item();
        }
    }

    loadUrls() {
        Rest.get(this.root).done(function (data) {
            this.urls = new ApiUrl(this, data);
            this.notifyLoaded();
        }.bind(this));
    }

    user(username = null) {
        var user = new User(this, username);
        return user;
    }
}

class ApiUrl {
    constructor(api, urls) {
        this.api = api;
        this.urls = urls;
    }

    user(username = null) {
        if (username == null) {
            return this.urls['current_user']
        } else {
            return URI.expand(this.urls['user'], {id: username})
        }
    }
}

class User {
    constructor(api, username = null) {
        this.api = api;
        this.username = username
    }

    getInfo() {
        var url = api.urls.user(this.username);
        return Rest.get(url).done(function (data) {
            for (let key of Object.keys(data)) {
                this[key] = data[key];
            }
        }.bind(this));
    }
}

var api = new Api();
api.onLoad(function () {
    console.log('ready...');
    console.log(api.urls);
    var u = api.user('grahamludwinski');
    u.getInfo().done(function (user) {
        console.log(user);
        console.log('user obj: ');
        console.log(u);
    }).done(function (user) {
        console.log('kooked: ' + JSON.stringify(user));
    })
});

