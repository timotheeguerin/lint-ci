class Association {
    static counter = 0;

    constructor(url, cls) {
        if (!url instanceof Promise) {
            url = Promise.resolve(url);
        }
        this.baseUrl = url;
        this.cls = cls;
        this.filter = {};
        this.reset();
        this.id = Association.counter++;
        this.unique = false;
    }

    clone() {
        let copy = new this.constructor(this.baseUrl, this.cls);
        copy.filter = this.filter;
        return copy
    }


    reset() {
        this.allPromise = new Promise((resolve) => {
                this.allResolve = resolve;
            }
        );
        this.reachedLast = false;
        this.items = [];
        this.item = null;
    }

    proxyPromise(key, callback) {
        key = `${this.id}_${key}`;
        return PromiseOnce.get(key, (...args) => {
            callback(...args);
        });
    }

    clearPromise(key) {
        key = `${this.id}_${key}`;
        PromiseOnce.clear(key);
    }

    getItem(item) {
        if (this.cls == null) {
            return item
        } else {
            return new this.cls(this.api, item)
        }
    }

    processData(data) {
        if (Array.isArray(data)) {
            var items = [];
            for (let item of data) {
                items.push(this.getItem(item))
            }
            this.unique = false;
            this.items = this.items.concat(items);
        } else {
            this.item = this.getItem(data);
            this.unique = true;
        }
    }

    processLinkHeader(links) {
        this._next_url = links.next;
        if (links.next == undefined) {
            this.reachedLast = true;
        }
    }

    where(filter) {
        let other = this.clone();
        other.filter = filter;
        return other;
    }

    computeUrl() {
        return new Promise((resolve, reject) => {
            this.baseUrl.then((url)=> {
                try {
                    resolve(URI(url).query(this.filter));
                } catch (error) {
                    console.error(`Error while generation url for association with base url ${this.baseUrl}`);
                    reject(error);
                }
            });
        });
    }

    computeNextUrl() {
        if (this._next_url == undefined) {
            return this.computeUrl();
        } else {
            return Promise.resolve(this._next_url);
        }
    }

    hasMore() {
        return !this.reachedLast;
    }

    hasDataLoaded() {
        return this.unique ? this.item !== null : this.items.length > 0;
    }

    loadedData() {
        return this.unique ? this.item : this.items;
    }

    /**
     * Will fetch the first batch items
     * If any items are already loaded it will not load more
     */
    fetch() {
        if (this.hasDataLoaded()) {
            return Promise.resolve(this.items);
        } else {
            return this.fetchNext();
        }
    }

    _fetch(resolve) {
        this.computeNextUrl().then((url) => {
            Rest.get(url).done((data, _, xhr) => {
                this.clearPromise('fetchNext');
                this.processLinkHeader(getLinkHeader(xhr));
                this.processData(data);
                resolve(this.loadedData());
            });
        });
    }

    /**
     * Fetch the next batch of items.
     * If it is currently waiting for a new batch it will not ask for 2(Will wait for the requested one)
     */

    fetchNext() {
        if (this.hasMore()) {
            return this.proxyPromise('fetchNext', (resolve) => {
                this._fetch(resolve);
            });
        } else {
            return Promise.resolve(this.items);
        }
    }

    /**
     * Call fetchNext until no more result
     * @returns {Promise|*}
     */
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

    /**
     * Filter the association and return the first result only
     * @param filter
     * @returns {Promise} that will resolve the first item
     */
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

    /**
     * Find by id
     * @param id Id of the item
     * @returns {Promise}
     */
    find(id) {
        return this.findBy({id: id});
    }
}
