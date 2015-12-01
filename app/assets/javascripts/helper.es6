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

class ModelHelper {
    static convert(obj, modelCls) {
        if (obj instanceof modelCls) {
            return obj;
        } else {
            return new modelCls(obj);
        }
    }

    static convertArray(objects, modelCls) {
        return objects.map((x) => {
            return ModelHelper.convert(x, modelCls)
        });
    }
}

class Load {
    static association(association, modelCls, callback) {
        if (association instanceof RelationshipProxy) {
            association.fetchAll().then(callback);
        } else if (association instanceof Promise) {
            association.then(callback);
        } else {
            let objects = ModelHelper.convertArray(association, modelCls);
            //Timeout so it can be called in constructor on React component
            setTimeout(() => {
                callback(objects);
            }, 0);
        }
    }
}

function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
}
