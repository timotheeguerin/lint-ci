/**
 * Class to execute action at the next location(Page load)
 */
class Persistent {
    static key = '_persistentCallbacks';

    static currentData = [];

    static saveToStorage() {
        if (Persistent.currentData.length === 0) {
            window.sessionStorage.removeItem(Persistent.key);
        } else {
            console.log("save to storage: ", Persistent.currentData);
            let json = JSON.stringify(Persistent.currentData);
            window.sessionStorage.setItem(Persistent.key, json);
        }
    }

    static performAtNextLocation(callback, ...args) {
        this.currentData.push({
            callback: callback.toString(),
            args: args
        });
        this.saveToStorage();
    }

    static performAfterGoto(location, callback, ...args) {
        this.performAtNextLocation(callback, ...args);
        window.location = location;
    }

    static triggerAll() {
        let data = window.sessionStorage.getItem(Persistent.key);
        if (data) {
            try {
                let callbacks = JSON.parse(data);

                if (Array.isArray(callbacks)) {
                    for (let callback of callbacks) {
                        let func = this.rebuildFunction(callback.callback);
                        this.exec(func, callback.args);
                    }
                }
            } catch (_) {
            } finally {
                window.sessionStorage.setItem(Persistent.key, undefined);
            }
        }
    }

    static rebuildFunction(functionStr) {
        try {
            return new Function('args', `var f = (${functionStr});f.apply(null, args);`);
        } catch (e) {
            console.error("There was an error while rebuilding the callback", error);
            throw e;
        }
    }

    static exec(func, args) {
        try {
            if (args) {
                func(args);
            } else {
                func();
            }
        } catch (error) {
            console.error("There was an error while executing the callback", error);
            throw e;
        }
    }
}

// Check if there is any persistent callback to be trigger when loading the page
$(document).ready(() => {
    setTimeout(() => {
        Persistent.triggerAll();
    }, 1000)
});

