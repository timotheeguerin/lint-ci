class PromiseOnce {
    static get(key, callback) {
        if (key in PromiseOnce.promises) {
            return PromiseOnce.promises[key];
        } else {
            return PromiseOnce.promises[key] = new Promise(callback);
        }
    }

    static clear(key) {
        delete PromiseOnce.promises[key]
    }
}
PromiseOnce.promises = {};

class RelationshipProxy {
    constructor(api, record, relationship, cls) {
        this.api = api;
        this.cls = cls;
        this.record = record;
        this.relationship = relationship;
        this.filter = {};
        this.id = RelationshipProxy.counter++;
    }

    clone() {
        let copy = new this.constructor(this.api, this.record, this.relationship, this.cls);
        copy.filter = this.filter;
        return copy
    }

    get url() {
        try {
            let url = URI(this.record[`${this.relationship}_url`]);
            return url.query(this.filter);
        } catch (error) {
            console.error(`Error while generating url for relation ship '${this.relationship}' ` +
                `value is '${this.record[`${this.relationship}_url`]}'`)
            throw error;
        }
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
                items.push(this.getItem(item))
            }
            return items;
        } else {
            return this.getItem(data);
        }
    }

    where(filter) {
        let other = this.clone();
        other.filter = filter;
        return other;
    }

    proxyPromise(key, callback) {
        key = `${this.id}_${key}`;
        return PromiseOnce.get(key, (...args) => {
            this.record.fetch().then(() => {
                callback(...args);
            });
        });
    }

    clearPromise(key) {
        key = `${this.id}_${key}`;
        PromiseOnce.clear(key);
    }

    _fetch() {
        throw '_fetch not implemented!'
    }


    loadRelationship(resolve) {
        Rest.get(this.url).done((data) => {
            var value = this.computeRelationshipValue(data);
            this.setRelationshipValue(value);
            resolve(this.getRelationshipValue());
        });
    }
}
RelationshipProxy.counter = 0;

class HasManyRelationship extends RelationshipProxy {
    constructor(...args) {
        super(...args);
        this.resetFetchAllPromise();
    }

    resetFetchAllPromise() {
        this.allPromise = new Promise((resolve) => {
                this.allResolve = resolve;
            }
        );
        this.reachedLast = false;
        this.items = [];
        this.setRelationshipValue([]);
    }

    get nextUrl() {
        console.log("next url is:", this._next_url);
        if (this._next_url == undefined) {
            return this.url;
        } else {
            return this._next_url;
        }
    }

    hasMore() {
        return !this.reachedLast;
    }

    // Iterate thought all the page
    fetchAll() {
        this.fetchNext().then((data) => {
            if (this.reachedLast) {
                this.allResolve(data);
            } else {
                this.fetchAll()
            }
        });
        return this.allPromise;
    }

    // Fetch will only load if no items have already been loaded
    // Use fetchNext to load the next page or fetchAll to load them all.
    fetch() {
        if (this.items.length > 0) {
            return Promise.resolve(this.items);
        } else {
            return this.fetchNext();
        }
    }

    _fetch(resolve) {
        Rest.get(this.nextUrl).done((data, _, xhr) => {
            this.clearPromise('fetchNext');
            this._handleLinkHeader(getLinkHeader(xhr));
            for (let item of data) {
                this.items.push(this.getItem(item))
            }
            resolve(this.items);
        });
    }

    fetchNext() {
        if (this.hasMore()) {
            return this.proxyPromise('fetchNext', (resolve) => {
                this._fetch(resolve);
            });
        } else {
            return Promise.resolve(this.items);
        }
    }

    _handleLinkHeader(links) {
        this._next_url = links.next;
        if (links.next == undefined) {
            this.reachedLast = true;
        }
    }

    findBy(filter) {
        return new Promise((resolve) => {
            this.where(filter).fetch().then((items) => {
                if (items.length > 0) {
                    resolve(items[0]);
                } else {
                    resolve(null);
                }
            });
        });
    }

    find(id) {
        return this.findBy({id: id});
    }

}

class HasOneRelationship extends RelationshipProxy {
    fetch() {
        if (this.item) {
            return Promise.resolve(this.item);
        } else {
            return this.proxyPromise('fetch', (resolve) => {
                this._fetch(resolve);
            });
        }
    }

    _fetch(resolve) {
        Rest.get(this.url).done((data) => {
            this.item = this.getItem(data);
            resolve(this.item);
            this.clearPromise('fetch');
        });
    }
}
