class Timer {
    constructor(callback, delay) {
        this.callback = callback;
        this.delay = delay;
        this.remaining = delay;
        this.resume();
    }

    pause() {
        clearTimeout(this.timerId);
        this.remaining -= new Date() - this.start;
    };

    resume() {
        this.start = new Date();
        clearTimeout(this.timerId);
        this.timerId = setTimeout(this.callback, this.remaining);
    };

    clear() {
        clearTimeout(this.timerId);
    };
}

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

class NotificationSystem extends React.Component {
    uid = 0;

    static defaultProps = {
        noAnimation: false
    };

    constructor(props) {
        super(props);
        this.state = {
            notifications: []
        }
    }


    _didNotificationRemoved(uid) {
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
    }

    addNotification(notification) {
        var notifications = this.state.notifications;

        notification.uid = this.uid;
        notification.ref = "notification-" + this.uid;
        this.uid += 1;

        notifications.push(notification);

        this.setState({
            notifications: notifications
        });
    }

    componentDidMount() {
        this.notification_event = EventManager.on('notification', (notification) => {
            this.addNotification(notification);
        });
    }

    componentWillUnmount() {
        this.notification_event.destroy();
    }

    render() {
        var containers = null;
        var notifications = this.state.notifications;

        if (notifications.length) {
            containers = Object.keys(Notification.Positions).map((key) => {
                var position = Notification.Positions[key];
                var _notifications = notifications.filter(function (notification) {
                    return position === notification.position;
                });
                console.log(position, key);
                if (_notifications.length) {
                    return (
                        <NotificationContainer
                            key={position.toString()}
                            position={position}
                            notifications={_notifications}
                            onRemove={this._didNotificationRemoved.bind(this)}
                            noAnimation={this.props.noAnimation}
                            allowHTML={this.props.allowHTML}
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
}
