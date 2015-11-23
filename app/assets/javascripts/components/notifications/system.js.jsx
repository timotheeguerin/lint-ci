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
        var notifications = this.state.notifications;

        notification.uid = this.uid;
        notification.ref = "notification-" + this.uid;
        this.uid += 1;

        notifications.push(notification);

        this.setState({
            notifications: notifications
        });
    },

    componentDidMount: function () {
        this.notification_event = EventManager.on('notification', (notification) => {
            this.addNotification(notification);
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
            containers = Object.keys(Notification.Positions).map(function (position) {

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
