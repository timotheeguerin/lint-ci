class PromiseOnce {
    static promises = {};

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

class RelationshipProxy {
    static counter = 0;

    constructor(api, record, relationship, cls) {
        this.api = api;
        this.cls = cls;
        this.record = record;
        this.relationship = relationship;
        this.filter = {};
        this.id = RelationshipProxy.counter++;
        this.association = new Association(this.url, this.cls);

        this.record.fetch().then((record)=> {
            this.record = record;
        });
    }

    reset() {
        this.association.reset();
    }

    clone() {
        return new this.constructor(this.api, this.record, this.relationship, this.cls);
    }

    get url() {
        return new Promise((resolve, reject) => {
            this.record.fetch().then((record)=> {
                try {
                    let url = URI(this.record[`${this.relationship}_url`]);
                    resolve(url.query(this.filter));
                } catch (error) {
                    console.error(`Error while generating url for relation ship '${this.relationship}' ` +
                        `value is '${this.record[`${this.relationship}_url`]}'`)
                    throw error;
                }
            });
        });
    }
}

class HasManyRelationship extends RelationshipProxy {
    constructor(...args) {
        super(...args);
    }

    resetFetchAllPromise() {
        console.warn("Deprecated: #resetFetchAllPromise() is deprecated use #reset()");
        this.reset();
    }

    fetchAll() {
        return this.association.fetchAll();
    }

    fetch() {
        return this.association.fetch();
    }

    fetchNext() {
        return this.association.fetchNext();
    }

    hasMore() {
        return this.association.hasMore();
    }

    where(filter) {
        let other = this.clone();
        other.association = this.association.where(filter);
        return other;
    }
}

class HasOneRelationship extends RelationshipProxy {
    constructor(...args) {
        super(...args);
    }

    fetch() {
        return this.association.fetch();
    }
}
