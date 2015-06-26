var defaultWidth = 320;
var defaultColors = {
    success: '#5ea400',
    error: '#ec3d3d',
    warning: '#ebad1a',
    info: '#369cc7'
};


var Styles = {

    Wrapper: {},
    Containers: {}
};

var Constants = {
    // Positions
    positions: {
        tl: 'tl',
        tr: 'tr',
        tc: 'tc',
        bl: 'bl',
        br: 'br',
        bc: 'bc'
    },

    // Levels
    levels: {
        success: 'success',
        error: 'error',
        warning: 'warning',
        info: 'info'
    },

    // Notification defaults
    notification: {
        title: null,
        message: null,
        level: null,
        position: 'tr',
        autoDismiss: 5,
        dismissible: true,
        action: null
    }
};

var Helpers = {
    inArray: function (needle, haystack) {
        needle = needle.toLowerCase();
        var length = haystack.length;
        for (var i = 0; i < length; i++) {
            var hs = haystack[i].toLowerCase();
            if (hs === needle) return true;
        }
        return false;
    },

    timer: function (callback, delay) {
        var timerId, start, remaining = delay;

        this.pause = function () {
            clearTimeout(timerId);
            remaining -= new Date() - start;
        };

        this.resume = function () {
            start = new Date();
            clearTimeout(timerId);
            timerId = setTimeout(callback, remaining);
        };

        this.clear = function () {
            clearTimeout(timerId);
        };

        this.resume();
    }
};


/* From Modernizr */
function whichTransitionEvent() {
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd'
    };

    for (t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }
}

var NotificationSystem = React.createClass({

    uid: null,

    _didNotificationRemoved: function (uid) {
        var notification;
        var notifications = this.state.notifications.filter(function (toCheck) {
            if (toCheck.uid === uid) {
                notification = toCheck;
            }
            return toCheck.uid !== uid;
        });

        if (notification && notification.onRemove) {
            notification.onRemove(notification);
        }

        this.setState({notifications: notifications});
    },

    getInitialState: function () {
        return {
            notifications: []
        }
    },

    getDefaultProps: function () {
        return {
            noAnimation: false
        }
    },

    addNotification: function (notification) {
        var notification = $.extend({}, Constants.notification, notification);

        var error = false;

        try {
            if (!notification.level) {
                throw "notification level is required."
            }

            if (isNaN(notification.autoDismiss)) {
                throw "'autoDismiss' must be a number."
            }

            if (!Helpers.inArray(notification.position, Object.keys(Constants.positions))) {
                throw "'" + notification.position + "' is not a valid position."
            }

            if (!Helpers.inArray(notification.level, Object.keys(Constants.levels))) {
                throw "'" + notification.level + "' is not a valid level."
            }

            if (!notification.dismissible && !notification.action) {
                throw "You need to set notification dismissible to true or set an action, otherwise user will not be able to dismiss the notification."
            }

        } catch (err) {
            error = true;
            console.error('Error adding notification: ' + err);
        }

        if (!error) {
            var notifications = this.state.notifications;

            // Some preparations
            notification.position = notification.position.toLowerCase();
            notification.level = notification.level.toLowerCase();
            notification.autoDismiss = parseInt(notification.autoDismiss);

            notification.uid = this.uid;
            notification.ref = "notification-" + this.uid;
            this.uid += 1;

            notifications.push(notification);

            this.setState({
                notifications: notifications
            });
        }

    },

    componentDidMount: function () {
        this.notification_event = EventManager.on('notification', (notification) => {
            console.log('receive not', notification);
            this.addNotification(notification);
        });


        EventManager.trigger('notification', {
            level: 'info',
            title: 'Test notification',
            message: 'This is working <a>Some</a>',
            callback: (x) => console.log('wowow')
        });
    },
    componentWillUnmount: function () {
        this.notification_event.destroy();
    },
    render: function () {
        var self = this;
        var containers = null;
        var notifications = this.state.notifications;

        if (notifications.length) {
            containers = Object.keys(Constants.positions).map(function (position) {

                var _notifications = notifications.filter(function (notification) {
                    return position === notification.position;
                });

                if (_notifications.length) {
                    return (
                        <NotificationContainer
                            key={position}
                            position={position}
                            notifications={_notifications}
                            onRemove={self._didNotificationRemoved}
                            noAnimation={self.props.noAnimation}
                            allowHTML={self.props.allowHTML}
                            />
                    );
                }
            });
        }


        return (
            <div className="notifications-wrapper">
                {containers}
            </div>

        );
    }
});
