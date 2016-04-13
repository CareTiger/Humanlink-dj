/**
 * HTML5 notifications.
 * Docs: https://developer.mozilla.org/en-US/docs/Web/API/notification
 *
 * This service is a generic wrapper around the HTML5 Notification API.
 */
(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .factory('NotificationManager', NotificationManager);

    /** ngInject */
    function NotificationManager($window, $timeout, $q) {

        var notif = {
            permission: null,
            isGranted: isGranted,
            requestPermission: requestPermission,
            showNotification: showNotification
        };

        if ($window.Notification) {
            notif.permission = Notification.permission;
        }

        return notif;

        /**
         * Wraps `Notification.requestPermission` in a promise;
         * @return {Promise}
         */
        function requestPermission() {
            var defer = $q.defer();

            if (!$window.Notification) {
                return defer.reject('HTML5 Notification not supported.');
            }
            if (isGranted()) {
                return defer.resolve(Notification.permission);
            }
            Notification.requestPermission(function (permission) {
                if (Notification.permission != permission) {
                    Notification.permission = permission;
                }
                notif.permission = permission;
                return defer.resolve(permission);
            });

            return defer.promise;
        }

        /**
         * Displays a notification for 10 seconds.
         *
         * See `window.Notification` for argument descriptions.
         *
         * @return {window.Notification | undefined}
         */
        function showNotification(title, options, onclick) {
            if ($window.document.hasFocus() || !isGranted()) {
                return;
            }
            var n = new Notification(title, options);
            if (angular.isFunction(onclick)) {
                n.onclick = onclick;
            }
            $timeout(n.close.bind(n), 10000);
            return n;
        }

        function isGranted() {
            return $window.Notification && Notification.permission === 'granted';
        }

    }

})();