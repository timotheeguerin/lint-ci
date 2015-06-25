var CONSTANTS = {
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


var NotificationContainer = React.createClass({
    propTypes: {
        position: React.PropTypes.string.isRequired,
        notifications: React.PropTypes.array.isRequired
    },

    _style: {},

    componentWillMount: function () {
        // Fix position if width is overrided
        this._style = this.props.getStyles.container(this.props.position);

        if (this.props.getStyles.overrideWidth && (this.props.position === Constants.positions.tc || this.props.position === Constants.positions.bc)) {
            this._style['marginLeft'] = -(this.props.getStyles.overrideWidth / 2);
        }
    },

    render: function () {
        var self = this;

        if (Helpers.inArray(this.props.position, [Constants.positions.bl, Constants.positions.br, Constants.positions.bc])) {
            this.props.notifications.reverse();
        }

        var notifications = this.props.notifications.map(function (notification) {
            return (
                <NotificationItem
                    key={notification.uid}
                    notification={notification}
                    getStyles={self.props.getStyles}
                    onRemove={self.props.onRemove}
                    noAnimation={self.props.noAnimation}
                    allowHTML={self.props.allowHTML}
                    />
            );
        });

        return (
            <div className={'notifications-' + this.props.position} style={this._style}>
                {notifications}
            </div>
        );
    }
});

var NotificationItem = React.createClass({

    propTypes: {
        notification: React.PropTypes.object,
        onRemove: React.PropTypes.func,
        allowHTML: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            noAnimation: false,
            onRemove: function (uid) {
            },
            allowHTML: false
        };
    },

    getInitialState: function () {
        return {
            visible: false,
            removed: false,
        };
    },

    componentWillMount: function () {
        var getStyles = this.props.getStyles;
        var level = this.props.notification.level;

        this._noAnimation = this.props.noAnimation;

        this._styles = {
            notification: getStyles.notification(level),
            title: getStyles.title(level),
            dismiss: getStyles.dismiss(level),
            messageWrapper: getStyles.messageWrapper(level),
            actionWrapper: getStyles.actionWrapper(level),
            action: getStyles.action(level)
        };

        if (!this.props.notification.dismissible) {
            this._styles.notification.cursor = 'default';
        }
    },

    _styles: {},

    _notificationTimer: null,

    _height: 0,

    _noAnimation: null,

    _getCssPropertyByPosition: function () {
        var position = this.props.notification.position;
        var css = {};

        switch (position) {
            case Constants.positions.tl:
            case Constants.positions.bl:
                css = {
                    property: 'left',
                    value: -200
                };
                break;

            case Constants.positions.tr:
            case Constants.positions.br:
                css = {
                    property: 'right',
                    value: -200
                };
                break;

            case Constants.positions.tc:
                css = {
                    property: 'top',
                    value: -100
                };
                break;

            case Constants.positions.bc:
                css = {
                    property: 'bottom',
                    value: -100
                };
                break;
        }

        return css;
    },

    _defaultAction: function (event) {
        event.preventDefault();
        var notification = this.props.notification;
        this._hideNotification();
        notification.action.callback();
    },

    _hideNotification: function () {
        if (this._notificationTimer) {
            this._notificationTimer.clear();
        }

        if (this.isMounted()) {
            this.setState({
                visible: false,
                removed: true
            });
        }

        if (this._noAnimation) {
            this._removeNotification();
        }
    },

    _removeNotification: function () {
        this.props.onRemove(this.props.notification.uid);
    },

    _dismiss: function () {
        if (!this.props.notification.dismissible) {
            return;
        }

        this._hideNotification();
    },

    _showNotification: function () {
        var self = this;
        setTimeout(function () {
            self.setState({
                visible: true,
            });
        }, 50);
    },

    componentDidMount: function () {
        var self = this;
        var transitionEvent = whichTransitionEvent();
        var notification = this.props.notification;

        var element = React.findDOMNode(this);

        this._height = element.offsetHeight;

        // Watch for transition end
        var count = 0;

        if (!this._noAnimation) {
            if (transitionEvent) {
                element.addEventListener(transitionEvent, function () {
                    if (count > 0) return;
                    if (self.state.removed) {
                        count++;
                        self._removeNotification();
                    }
                });
            } else {
                this._noAnimation = true;
            }
        }


        if (notification.autoDismiss) {
            this._notificationTimer = new Helpers.timer(function () {
                self._hideNotification();
            }, notification.autoDismiss * 1000);

            element.addEventListener('mouseenter', function () {
                self._notificationTimer.pause();
            });

            element.addEventListener('mouseleave', function () {
                self._notificationTimer.resume();
            });
        }

        this._showNotification();

    },

    _allowHTML: function (string) {
        if (true) {
            return {__html: string};
        }

        return string;
    },

    render: function () {
        var self = this;
        var notification = this.props.notification;

        var className = 'notification notification-' + notification.level;

        if (this.state.visible) {
            className = className + ' notification-visible';
        } else {
            className = className + ' notification-hidden';
        }

        if (!notification.dismissible) {
            className = className + ' notification-not-dismissible';
        }

        if (this.props.getStyles.overrideStyle) {
            var cssByPos = this._getCssPropertyByPosition();
            if (!this.state.visible && !this.state.removed) {
                this._styles.notification[cssByPos.property] = cssByPos.value;
            }

            if (this.state.visible && !this.state.removed) {
                this._styles.notification.height = this._height;
                this._styles.notification[cssByPos.property] = 0;
            }

            if (this.state.removed) {
                this._styles.notification.overlay = 'hidden';
                this._styles.notification.height = 0;
                this._styles.notification.marginTop = 0;
                this._styles.notification.paddingTop = 0;
                this._styles.notification.paddingBottom = 0;
            }
            this._styles.notification.opacity = this.state.visible ? this._styles.notification.isVisible.opacity : this._styles.notification.isHidden.opacity;
        }

        var dismiss = null;
        var actionButton = null;
        var title = null;
        var message = null;

        if (notification.title) {
            title = <h4 className="notification-title"
                        style={this._styles.title}>{notification.title}</h4>;
        }

        if (notification.message) {
            if (this.props.allowHTML) {
                message = (
                    <div className="notification-message" style={this._styles.messageWrapper}
                         dangerouslySetInnerHTML={this._allowHTML(notification.message)}></div>
                );
            } else {
                message = (
                    <div className="notification-message"
                         style={this._styles.messageWrapper}>{notification.message}</div>
                );
            }
        }

        if (notification.dismissible) {
            dismiss =
                <span className="notification-dismiss" style={this._styles.dismiss}>&times;</span>;
        }

        if (notification.action) {
            actionButton = (
                <div className="notification-action-wrapper" style={this._styles.actionWrapper}>
                    <button className="notification-action-button" onClick={this._defaultAction}
                            style={this._styles.action}>{notification.action.label}</button>
                </div>
            );
        }

        return (
            <div className={className} onClick={this._dismiss} style={this._styles.notification}>
                {title}
                {message}
                {dismiss}
                {actionButton}
            </div>
        );
    }

});

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

    uid: 3400,

    _getStyles: {
        overrideStyle: {},

        overrideWidth: null,

        setOverrideStyle: function (style) {
            this.overrideStyle = style;
        },

        wrapper: function () {
            if (!this.overrideStyle) return {};
            var override = this.overrideStyle.Wrapper || {};
            return merge({}, Styles.Wrapper, this.overrideStyle);
        },

        container: function (position) {
            if (!this.overrideStyle) return {};
            var override = this.overrideStyle.Containers || {};

            this.overrideWidth = Styles.Containers.DefaultStyle.width;

            if (override.DefaultStyle && override.DefaultStyle.width) {
                this.overrideWidth = override.DefaultStyle.width;
            }

            if (override[position] && override[position].width) {
                this.overrideWidth = override[position].width;
            }

            return merge({}, Styles.Containers.DefaultStyle, Styles.Containers[position], override.DefaultStyle, override[position]);
        },

        notification: function (level) {
            if (!this.overrideStyle) return {};
            var override = this.overrideStyle.NotificationItem || {};
            return merge({}, Styles.NotificationItem.DefaultStyle, Styles.NotificationItem[level], override.DefaultStyle, override[level]);
        },

        title: function (level) {
            if (!this.overrideStyle) return {};
            var override = this.overrideStyle.Title || {};
            return merge({}, Styles.Title.DefaultStyle, Styles.Title[level], override.DefaultStyle, override[level]);
        },

        messageWrapper: function (level) {
            if (!this.overrideStyle) return {};
            var override = this.overrideStyle.MessageWrapper || {};
            return merge({}, Styles.MessageWrapper.DefaultStyle, Styles.MessageWrapper[level], override.DefaultStyle, override[level]);
        },

        dismiss: function (level) {
            if (!this.overrideStyle) return {};
            var override = this.overrideStyle.Dismiss || {};
            return merge({}, Styles.Dismiss.DefaultStyle, Styles.Dismiss[level], override.DefaultStyle, override[level]);
        },

        action: function (level) {
            if (!this.overrideStyle) return {};
            var override = this.overrideStyle.Action || {};
            return merge({}, Styles.Action.DefaultStyle, Styles.Action[level], override.DefaultStyle, override[level]);
        },

        actionWrapper: function (level) {
            if (!this.overrideStyle) return {};
            var override = this.overrideStyle.ActionWrapper || {};
            return merge({}, Styles.ActionWrapper.DefaultStyle, Styles.ActionWrapper[level], override.DefaultStyle, override[level]);
        },

    },

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
            style: {},
            noAnimation: false
        }
    },

    addNotification: function (notification) {
        var self = this;
        var notification = merge({}, Constants.notification, notification);

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
        this._getStyles.setOverrideStyle(this.props.style);
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
                            getStyles={self._getStyles}
                            onRemove={self._didNotificationRemoved}
                            noAnimation={self.props.noAnimation}
                            allowHTML={self.props.allowHTML}
                            />
                    );
                }
            });
        }


        return (
            <div className="notifications-wrapper" style={this._getStyles.wrapper()}>
                {containers}
            </div>

        );
    }
});


var defaultWidth = 320;
var defaultColors = {
    success: '#5ea400',
    error: '#ec3d3d',
    warning: '#ebad1a',
    info: '#369cc7'
}

var STYLES = {

    Wrapper: {},
    Containers: {
        DefaultStyle: {
            fontFamily: 'inherit',
            position: 'fixed',
            width: defaultWidth,
            padding: '0 10px 10px 10px',
            zIndex: 9998,
            WebkitBoxSizing: 'border-box',
            MozBoxSizing: 'border-box',
            boxSizing: 'border-box',
            height: 'auto'
        },

        tl: {
            top: "0px",
            bottom: "auto",
            left: '0px',
            right: 'auto'
        },

        tr: {
            top: "0px",
            bottom: "auto",
            left: 'auto',
            right: '0px'
        },

        tc: {
            top: "0px",
            bottom: "auto",
            margin: "0 auto",
            left: "50%",
            marginLeft: -(defaultWidth / 2)
        },

        bl: {
            top: "auto",
            bottom: "0px",
            left: '0px',
            right: 'auto'
        },

        br: {
            top: "auto",
            bottom: "0px",
            left: 'auto',
            right: '0px'
        },

        bc: {
            top: "auto",
            bottom: "0px",
            margin: "0 auto",
            left: "50%",
            marginLeft: -(defaultWidth / 2)
        }

    },

    NotificationItem: {
        DefaultStyle: {
            position: 'relative',
            width: '100%',
            cursor: 'pointer',
            borderRadius: '2px',
            fontSize: '13px',
            border: '1px solid',
            borderTopWidth: '4px',
            margin: '10px 0 0',
            padding: '10px',
            display: 'block',
            WebkitBoxSizing: 'border-box',
            MozBoxSizing: 'border-box',
            boxSizing: 'border-box',
            WebkitBoxShadow: '0px 0px 5px 2px rgba(0,0,0,0.1)',
            MozBoxShadow: '0px 0px 5px 2px rgba(0,0,0,0.1)',
            boxShadow: '0px 0px 5px 2px rgba(0,0,0,0.1)',
            opacity: 0,
            transition: '0.3s ease-in-out',

            isHidden: {
                opacity: 0
            },

            isVisible: {
                opacity: 0.9
            }
        },

        success: {
            borderColor: '#d0ddbe',
            borderTopColor: defaultColors.success,
            backgroundColor: '#f0f5ea',
            color: '#4b583a'
        },

        error: {
            borderColor: '#edbfbf',
            borderTopColor: defaultColors.error,
            backgroundColor: '#f4e9e9',
            color: '#412f2f'
        },

        warning: {
            borderColor: '#ecd9ab',
            borderTopColor: defaultColors.warning,
            backgroundColor: '#f9f6f0',
            color: '#5a5343'
        },

        info: {
            borderColor: '#b2d0dd',
            borderTopColor: defaultColors.info,
            backgroundColor: '#e8f0f4',
            color: '#41555d'
        }
    },

    Title: {
        DefaultStyle: {
            fontSize: '14px',
            margin: '0 0 5px 0',
            padding: 0,
            fontWeight: 'bold'
        },

        success: {
            color: defaultColors.success
        },

        error: {
            color: defaultColors.error
        },

        warning: {
            color: defaultColors.warning
        },

        info: {
            color: defaultColors.info
        }

    },

    MessageWrapper: {
        DefaultStyle: {
            margin: 0,
            padding: 0
        }
    },

    Dismiss: {
        DefaultStyle: {
            fontFamily: 'Arial',
            fontSize: '17px',
            position: 'absolute',
            top: '4px',
            right: '5px',
            lineHeight: '15px',
            backgroundColor: '#dededf',
            color: '#ffffff',
            borderRadius: '50%',
            width: '14px',
            height: '14px',
            fontWeight: 'bold',
            textAlign: 'center'
        },

        success: {
            color: '#f0f5ea',
            backgroundColor: '#b0ca92'
        },

        error: {
            color: '#f4e9e9',
            backgroundColor: '#e4bebe'
        },

        warning: {
            color: '#f9f6f0',
            backgroundColor: '#e1cfac'
        },

        info: {
            color: '#e8f0f4',
            backgroundColor: '#a4becb'
        }
    },

    Action: {
        DefaultStyle: {
            background: '#ffffff',
            borderRadius: '2px',
            padding: '6px 20px',
            fontWeight: 'bold',
            margin: '10px 0 0 0',
            border: 0
        },

        success: {
            backgroundColor: defaultColors.success,
            color: '#ffffff'
        },

        error: {
            backgroundColor: defaultColors.error,
            color: '#ffffff'
        },

        warning: {
            backgroundColor: defaultColors.warning,
            color: '#ffffff'
        },

        info: {
            backgroundColor: defaultColors.info,
            color: '#ffffff'
        }
    },

    ActionWrapper: {
        DefaultStyle: {
            margin: 0,
            padding: 0
        }
    }
};
