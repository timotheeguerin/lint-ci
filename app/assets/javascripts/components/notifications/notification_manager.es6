/**
 * Class for calling notifications
 * e.g.
 * NotificationManager.warn('Happening...', 'Something is happening');
 * NotificationManager.warn('Happening...', 'Something is happening', {
 *   position: Notification.Positions.tl
 * });
 */
class NotificationManager {
    static notify(level, title, message, options) {
        let notification = new Notification(level, title, message, options);
        return new NotificationProxy(notification);
    }

    static notifyNow(notification) {
        EventManager.trigger('notification', notification);
    }

    static warning(...args) {
        return NotificationManager.notify('warning', ...args)
    }

    static warn = (...args) => {
        return NotificationManager.warning(...args)
    };

    static success(...args) {
        return NotificationManager.notify('success', ...args)
    }

    static info(...args) {
        return NotificationManager.notify('info', ...args)
    }

    static inform = (...args) => {
        return NotificationManager.info(...args)
    };

    static error(...args) {
        return NotificationManager.notify('error', ...args)
    }

    /**
     * This will notify an error from the server
     * @param error JQuery error returned
     */
    static serverError(error) {
        let title = I18n.t("notification.server_error");
        let message = I18n.t(`common.error.${error.statusCode}`);
        this.error(title, message);
    }
}

class NotificationProxy {
    constructor(notification) {
        this.notification = notification;
    }

    /**
     * Show notification right now
     */
    now() {
        NotificationManager.notifyNow(this.notification);
    }

    /**
     * Show the notification in x milliseconds
     * @milliseconds Time in milliseconds for when the notification will be shown
     */
    in(milliseconds) {
        setTimeout(() => {
            this.now();
        }, milliseconds);
    }

    /**
     * Goto the given location and then show up the notification when page load.
     * @param location Relative/Absolute url
     */
    afterGoto(location) {
        Persistent.performAfterGoto(location, (notificationHash) => {
            let notification = Notification.fromObject(notificationHash);
            NotificationManager.notifyNow(notification);
        }, this.notification);
    }
}
