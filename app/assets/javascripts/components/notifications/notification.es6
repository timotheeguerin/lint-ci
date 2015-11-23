class Position {
    // Vertical
    static top = 'top';
    static bottom = 'bottom';

    // Horizontal
    static left = 'left';
    static center = 'center';
    static right = 'right';

    constructor(vertical, horizontal) {
        this.vertical = vertical;
        this.horizontal = horizontal;
    }

    isTop() {
        return this.vertical == Position.Vertical.top
    }

    isBottom() {
        return this.vertical == Position.Vertical.bottom
    }

    toString() {
        return this.vertical[0] + this.horizontal[0]
    }
}

/**
 * Container class for notifications.
 */
class Notification {
    static Positions = {
        tl: new Position(Position.top, Position.left),
        tr: new Position(Position.top, Position.right),
        tc: new Position(Position.top, Position.center),
        bl: new Position(Position.bottom, Position.left),
        br: new Position(Position.bottom, Position.right),
        bc: new Position(Position.bottom, Position.center)
    };

    constructor(title, message, level, options = {}) {
        this.title = title;
        this.message = message;
        this.level = level;
        this.options = $.extend({}, this.defaultOptions(), options);
    }

    defaultOptions() {
        return {
            position: Notification.Positions.tr,
            autoDismiss: 5,
            dismissible: true,
            action: null
        }
    }

    get position() {
        return this.options['position'];
    }

    set position(value) {
        this.options['position'] = value;
    }

    get autoDismiss() {
        return this.options['autoDismiss'];
    }

    set autoDismiss(value) {
        if (isNaN(notification.autoDismiss)) {
            throw "'autoDismiss' must be a number."
        }
        this.options['autoDismiss'] = value;
    }

    get dismissible() {
        return this.options['dismissible'];
    }

    set dismissible(value) {
        this.options['dismissible'] = value;
    }

    get action() {
        return this.options['action'];
    }

    set action(value) {
        this.options['action'] = value;
    }
}


Notification.levels = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info'
};
