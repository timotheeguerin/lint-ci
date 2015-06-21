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
    constructor(api, record, relationship, cls) {
        this.api = api;
        this.cls = cls;
        this.record = record;
        this.relationship = relationship;
        this.response = new Deferred();

    }

    get url() {
        return URI(this.record[`${this.relationship}_url`])
    }

    getRelationshipValue() {
        var key = `_${this.relationship}`;
        return this.record[key];
    }


    setRelationshipValue(value) {
        var key = `_${this.relationship}`;
        this.record[key] = value;
    }

    getItem(item) {
        if (this.cls == null) {
            return item
        } else {
            return new this.cls(this.api, item)
        }
    }

    computeRelationshipValue(data) {
        if (Array.isArray(data)) {
            var items = [];
            for (let item of data) {
                this.push(this.getItem(item))
            }
            return items;
        } else {
            return this.getItem(data);
        }
    }

    fetch() {
        this.record.fetch().then(function () {
            if (this.getRelationshipValue() != undefined) {
                this.response.trigger(this.getRelationshipValue());
            } else {
                this.loadRelationship()
            }
        }.bind(this));
        return this.response;
    }

    loadRelationship() {
        Rest.get(this.url).done(function (data) {
            var value = this.computeRelationshipValue(data);
            this.setRelationshipValue(value);
            this.response.trigger(this.getRelationshipValue());
        }.bind(this)).fail(function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR, textStatus, errorThrown);
        });
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

    repos() {
        var proxy = new RelationshipProxy(this.api, this, 'repos', Repository);
        return proxy;
    }
}

class Repository extends Model {
    getUrl() {
        var username = (this.owner == undefined) ? this.owner_id : this.owner.username;
        return this.api.urls.repo(username, this.name);
    }

    revisions() {
        var proxy = new RelationshipProxy(this.api, this, 'revisions', Revision);
        return proxy;
    }
}


class Revision extends Model {
    getUrl() {
        return '';
    }

    set files(ary) {
        this._files = ary;
    }

    get files() {
        var proxy = new RelationshipProxy(this.api, this, 'files', RevisionFile);
        return proxy;
    }
}

class RevisionFile extends Model {
    getUrl() {
        return '';
    }

    set content(value) {
        this._content = value;
    }

    get content() {
        var proxy = new RelationshipProxy(this.api, this, 'content', null);
        return proxy;
    }
}

var api = new Api();

