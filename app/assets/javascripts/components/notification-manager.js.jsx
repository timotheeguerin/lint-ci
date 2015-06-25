class NotificationManager extends React.Component {
    componentDidMount() {
        this.notification_event = EventManager.on('notification', (notification) => {
            this.refs.notificationSystem.addNotification(notification);
        });
    }

    componentWillUnmount() {
        this.notification_event.destroy();
    }

    render() {
        return (
            <NotificationSystem ref="notificationSystem"/>
        )
    }
}
