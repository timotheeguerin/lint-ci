var guid = (function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return function () {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
})();


function isDefined(o) {
    return (typeof o !== "undefined" && o !== null)
}

function isNull(o) {
    return !isDefined(o)
}

class Load {
    static association(association, type, callback) {
        if (association instanceof RelationshipProxy) {
            association.fetchAll().then(callback);
        } else if (association instanceof Promise) {
            association.then(callback);
        } else {
            let objects = association.map((x) => {
                if (x instanceof type) {
                    return x;
                } else {
                    return new type(x);
                }
            });
            //Timeout so it can be called in constructor on React component
            setTimeout(() => {
                callback(objects);
            }, 0);
        }
    }
}
