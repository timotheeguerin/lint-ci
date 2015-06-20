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
        var user = new User(this, {username: username});
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

    repos(username = null) {
        if (username == null) {
            return this.urls['current_user_repos']
        } else {
            return URI.expand(this.urls['repos'], {user_id: username})
        }
    }

    repo(username, repo) {
        return URI.expand(this.urls['repo'], {user_id: username, id: repo})
    }
}
class Deferred {
    constructor() {
        this.callbacks = []
    }

    then(callback) {
        this.callbacks.push(callback);
        return this;
    }

    trigger(value) {
        for (let callback of this.callbacks) {
            callback(value);
        }
    }
}

class RelationshipProxy {
    constructor(api, record, cls, url_attr) {
        this.api = api;
        this.cls = cls;
        this.url_attr = url_attr;
        this.record = record;
    }

    get url() {
        return URI(this.record[this.url_attr])
    }

    fetch() {
        var response = new Deferred();
        this.record.fetch().then(function () {
            Rest.get(this.url).done(function (data) {
                var items = [];
                for (let item of data) {
                    items.push(new this.cls(this.api, item))
                }
                response.trigger(items);
            }.bind(this));
        }.bind(this));
        return response;
    }
}
class Model {
    constructor(api, attributes) {
        this.api = api;
        this.assign_attributes(attributes);
        this.cached = (this.id != undefined);
        this.cached = false;
    }

    assign_attributes(attrs) {
        if (attrs != null) {
            for (let key of Object.keys(attrs)) {
                this[key] = attrs[key];
            }
        }
    }

    set url(value) {
        this._url = value;
    }

    get url() {
        if (this._url == undefined) {
            if (this.api.urls == undefined) {
                return '';
            }
            return this.getUrl()
        } else {
            return this._url;
        }
    }

    fetch(force = false) {
        var response = new Deferred();
        if (!this.cached || force) {
            this.api.onLoad(function () {
                console.log('url: ' + this.url);
                Rest.get(this.url).done(function (data) {
                    this.assign_attributes(data);
                    this.cached = true;
                    response.trigger(this);
                }.bind(this));
            }.bind(this))
        }
        else {
            response.trigger(this);
        }
        return response;
    }

}

class User extends Model {
    getUrl() {
        this.api.urls.user(this.username);
    }

    repositories() {
        var proxy = new RelationshipProxy(this.api, this, Repository, 'repos_url');
        return proxy;
    }
}

class Repository extends Model {
    getUrl() {
        var username = (this.owner == undefined) ? this.owner_id : this.owner.username;
        return this.api.urls.repo(username, this.name);
    }

    revisions() {
        var proxy = new RelationshipProxy(this.api, this, Revision, 'revisions_url');
        return proxy;
    }
}


class Revision extends Model {
    getUrl() {
        return '';
    }
}

var api = new Api();
api.onLoad(function () {
    console.log('ready...');
    console.log(api.urls);
    var u = api.user('grahamludwinski');
    u.repositories().fetch().then(function (repos) {
        console.log(repos)
    });
});

