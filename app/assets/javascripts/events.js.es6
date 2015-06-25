class EventManager {
    static on(eventName, callback) {
        if (isNull(EventManager.subscribers[eventName])) {
            EventManager.subscribers[eventName] = [];
        }
        var listener = new EventListener();
        EventManager.subscribers[eventName][listener.id] = callback;
        return listener;
    }

    static trigger(eventName, ...args) {
        var subs = EventManager.subscribers[eventName];
        if (!isNull(subs)) {
            for (let sub of subs) {
                sub(...args);
            }
        }
    }

    static unbind(id) {
        for (var key in EventManager.subscribers) {
            delete EventManager.subscribers[key][id]
        }
    }
}
EventManager.subscribers = {};

class EventListener {
    constructor() {
        this.id = EventListener.id_count++;
    }

    destroy() {
        EventManager.unbind(this.id)
    }
}

EventListener.id_count = 0;
