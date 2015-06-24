class RelationshipProxy {
    constructor(api, record, relationship, cls) {
        this.api = api;
        this.cls = cls;
        this.record = record;
        this.relationship = relationship;
        this.filter = {};
        this.resetPromise()
    }

    resetPromise() {
        this.promise = new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            }
        )
    }

    get url() {
        let url = URI(this.record[`${this.relationship}_url`]);
        return url.query(this.filter);
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
        this.filter = filter;
        return this;
    }

    // Fetch the record
    fetch() {
        if (!this.fetching) {
            this.fetching = true;
            this.record.fetch().then(() => {
                this._fetch();
            });
            this.promise.then(() => {
                this.fetching = false;
            });
        }

        return this.promise
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

class HasManyRelationship extends RelationshipProxy {
    constructor(...args) {
        super(...args);
        this.reachedLast = false;
        this.setRelationshipValue([]);
        this.resetFetchAllPromise();
    }

    resetFetchAllPromise() {
        this.allPromise = new Promise((resolve) => {
                this.allResolve = resolve;
            }
        )
    }

    get nextUrl() {
        if (this._next_url == undefined) {
            return this.url;
        } else {
            return this._next_url;
        }
    }

    // Iterate thought all the page
    fetchAll() {
        this.fetch().then((data) => {
            if (this.reachedLast) {
                this.allResolve(data);
            } else {
                this.fetchAll()
            }
        });
        return this.allPromise;
    }

    _fetch() {
        Rest.get(this.nextUrl).done((data, _, xhr) => {
            this._handleLinkHeader(getLinkHeader(xhr));
            var items = [];
            for (let item of data) {
                items.push(this.getItem(item))
            }
            var cur = this.getRelationshipValue();
            this.setRelationshipValue(cur.concat(items));
            var resolve = this.resolve;
            this.resetPromise();
            resolve(this.getRelationshipValue());
        });
    }

    _handleLinkHeader(links) {
        this._next_url = links.next;
        if (links.next == undefined) {
            this.reachedLast = true;
        }
    }
}

class HasOneRelationship extends RelationshipProxy {
    _fetch() {
        if (this.getRelationshipValue() != undefined) {
            this.resolve(this.getRelationshipValue());
        } else {
            Rest.get(this.url).done((data) => {
                this.setRelationshipValue(this.getItem(data));
                this.resolve(this.getRelationshipValue());
            });
        }
    }
}
