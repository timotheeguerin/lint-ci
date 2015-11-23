var NotificationContainer = React.createClass({
    propTypes: {
        position: React.PropTypes.string.isRequired,
        notifications: React.PropTypes.array.isRequired
    },

    render: function () {
        if (this.props.position.isBottom()) {
            this.props.notifications.reverse();
        }

        var notifications = this.props.notifications.map((notification) => {
            return (
                <NotificationItem
                    key={notification.uid}
                    notification={notification}
                    getStyles={this.props.getStyles}
                    onRemove={this.props.onRemove}
                    noAnimation={this.props.noAnimation}
                    allowHTML={this.props.allowHTML}
                />
            );
        });

        return (
            <div className={'notifications-container ' + this.props.position}>
                {notifications}
            </div>
        );
    }
});
