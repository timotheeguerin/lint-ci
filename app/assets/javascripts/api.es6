//=require api/api-url

class Api {
    constructor(host = '') {
        this.root = URI(host + '/api/v1');
        this.ready = false;
        this.readyCallbacks = [];
        this.urls = new ApiUrl(this);
        this.urls.loadPromise.then(() => {
            this.notifyLoaded();
        });
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

    user(username = null) {
        return User(this, {username: username});
    }

    users() {
        return new Association(this.urls.users(), User);
    }
}

class Model {
    constructor(api, attributes) {
        this.api = api;
        this.assign_attributes(attributes);
        this.cached = (this.id != undefined);
        this.cached = false;
        this._proxy = {}
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
        return new Promise((resolve) => {
            if (!this.cached || force) {
                this.api.onLoad(function () {
                    Rest.get(this.url).done((data) => {
                        this.assign_attributes(data);
                        this.cached = true;
                        resolve(this);
                    });
                }.bind(this))
            }
            else {
                resolve(this);
            }
        });
    }


    hasOne(relation, cls) {
        if (!(relation in this._proxy)) {
            this._proxy[relation] = new HasOneRelationship(this.api, this, relation, cls);
        }
        return this._proxy[relation];
    }

    hasMany(relation, cls) {
        if (!(relation in this._proxy)) {
            this._proxy[relation] = new HasManyRelationship(this.api, this, relation, cls);
        }
        return this._proxy[relation];

    }

    /**
     * Call the server to destroy this model
     */
    destroy() {
        return Rest.delete(this.url);
    }
}

class User extends Model {
    getUrl() {
        return this.api.urls.user(this.username);
    }

    get repos() {
        return this.hasMany('repos', Repository);
    }
}

class Repository extends Model {
    getUrl() {
        var username = (this.owner == undefined) ? this.owner_id : this.owner.username;
        return this.api.urls.repo(username, this.name);
    }

    get branches() {
        return this.hasMany('branches', Branch);
    }
}

class Branch extends Model {
    getUrl() {
        return ''
    }

    get revisions() {
        return this.hasMany('revisions', Revision);
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
        return this.hasMany('files', RevisionFile);
    }

    get short_sha() {
        return this.sha && this.sha.substr(0, 6)
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
        return this.hasOne('content', null);
    }

    set offenses(ary) {
        this._offenses = ary;
    }

    get offenses() {
        return this.hasMany('offenses', Offense);

    }
}


class Offense extends Model {
    getUrl() {
        return '';
    }
}

// Get the link header from the xhr of jquery
function getLinkHeader(xhr) {
    return parseLinkHeader(xhr.getResponseHeader('Link'));
}
// Parse the link header
function parseLinkHeader(header) {
    if (header == null || header.length == 0) {
        return {};
    }

    // Split parts by comma
    var parts = header.split(',');
    var links = {};
    // Parse each part into a named link
    for (let p of parts) {
        var section = p.split(';');
        if (section.length != 2) {
            throw new Error("section could not be split on ';'");
        }
        var url = section[0].replace(/<(.*)>/, '$1').trim();
        var name = section[1].replace(/rel="(.*)"/, '$1').trim();
        links[name] = url;
    }

    return links;
}

var api = new Api();
