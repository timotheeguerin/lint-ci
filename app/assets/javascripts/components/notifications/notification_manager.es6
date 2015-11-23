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
        EventManager.trigger('notification', notification);
    }

    static warning(...args) {
        NotificationManager.notify('warning', ...args)
    }

    static warn = (...args) => {
        NotificationManager.warning(...args)
    };

    static success(...args) {
        NotificationManager.notify('success', ...args)
    }

    static info(...args) {
        NotificationManager.notify('info', ...args)
    }

    static inform = (...args) => {
        NotificationManager.info(...args)
    };

    static error(...args) {
        NotificationManager.notify('error', ...args)
    }
}
