class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject)=> {
            this.resolve = resolve;
            this.reject = reject;
        })
    }
}

class ApiUrl {
    constructor(api, urls = null) {
        this.api = api;
        this.urls = urls;
        this.deferred = new Deferred();
        if (!this.isLoaded()) {
            this.loadUrls();
        }
    }

    get loadPromise() {
        return this.deferred.promise;
    }

    loadUrls() {
        Rest.get(this.api.root).done((data)=> {
            this.urls = data;
            this.notifyLoaded();
        });
    }

    isLoaded() {
        return this.urls !== null;
    }

    notifyLoaded() {
        this.deferred.resolve(this)
    }

    promiseUrl(callback) {
        return new Promise((resolve, reject) => {
            this.loadPromise.then(() => {
                resolve(callback());
            });
        });
    }

    users() {
        return this.promiseUrl(() => this.urls['users'])
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

    branch(username, repo, branch) {
        return URI.expand(this.urls['branch'], {
            user_id: username,
            repository: repo,
            branch: branch
        })
    }
}
