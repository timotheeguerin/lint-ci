class NotificationItem extends React.Component {
    static propTypes = {
        notification: React.PropTypes.object,
        onRemove: React.PropTypes.func,
        allowHTML: React.PropTypes.bool
    };

    static defaultProps = {
        noAnimation: false,
        onRemove: function (uid) {
        },
        allowHTML: false
    };

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            removed: false
        };
    }

    componentWillMount() {
        this._noAnimation = this.props.noAnimation;

        if (!this.props.notification.dismissible) {
            this._Styles.notification.cursor = 'default';
        }
    }

    _notificationTimer = null;

    _height = 0;

    _noAnimation = null;

    _hideNotification() {
        if (this._notificationTimer) {
            this._notificationTimer.clear();
        }

        this.setState({
            visible: false,
            removed: true
        });

        if (this._noAnimation) {
            this._removeNotification();
        }
    }

    _removeNotification() {
        this.props.onRemove(this.props.notification.uid);
    }

    _showNotification() {
        var self = this;
        setTimeout(() => {
            self.setState({
                visible: true
            });
        }, 50);
    }

    componentDidMount() {
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
            this._notificationTimer = new Timer(() => {
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

    }

    html(string) {
        return {__html: string};
    }

    dismiss(e) {
        e.stopPropagation();
        if (!this.props.notification.dismissible) {
            return;
        }

        this._hideNotification();
    }

    handleClick(e) {
        var notification = this.props.notification;
        this.dismiss(e);
        if (notification.callback) {
            notification.callback()
        }
    }

    render() {
        var notification = this.props.notification;

        var classes = classNames('notification', notification.level, {
            'notification-hidden': !this.state.visible,
            'notification-not-dismissible': !notification.dismissible
        });

        return (
            <div className={classes} onClick={this.handleClick.bind(this)}>
                <div>
                    {this.renderTitle()}
                    {this.renderMessage()}
                </div>
                {this.renderDismiss()}
            </div>
        );
    }

    renderTitle() {
        var notification = this.props.notification;
        if (notification.title) {
            return <h4 className="notification-title">{notification.title}</h4>;
        } else {
            return null;
        }
    }

    renderMessage() {
        var notification = this.props.notification;
        if (notification.message) {
            if (!this.props.allowHTML) {
                return (
                    <div className="notification-message"
                         dangerouslySetInnerHTML={this.html(notification.message)}></div>
                );
            } else {
                return (
                    <div className="notification-message">{notification.message}</div>
                );
            }
        }
    }

    renderDismiss() {
        var notification = this.props.notification;
        if (notification.dismissible) {
            return <span className="notification-dismiss" onClick={this.dismiss.bind(this)}></span>;
        }
    }
}
