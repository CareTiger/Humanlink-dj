/**
 * Settings module.
 */
(function () {
    'use strict';

    angular
        .module('app.settings', [
            'app.core',
            'app.repo'
        ])
        .config(Config);

    /** ngInject */
    function Config($locationProvider, $stateProvider, $urlRouterProvider) {

        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/notifications');

        $stateProvider
            .state('settings', {
                abstract: true,
                views: {
                    '': {
                        templateUrl: '/views/settings/partials/main.html',
                        controller: 'Base',
                        controllerAs: 'base'
                    },
                    'loader@settings': {
                        templateUrl: '/views/settings/partials/loader.html'
                    }
                }
            })
            .state('settings.notifications', {
                url: '/notifications',
                templateUrl: '/views/settings/partials/notifications.html',
                controller: 'Notifications',
                controllerAs: 'vm'
            })
            .state('settings.payments', {
                url: '/payments',
                templateUrl: '/views/settings/partials/payments.html',
                controller: 'Payments',
                controllerAs: 'vm'
            })
            .state('settings.transactions', {
                url: '/transactions',
                template: 'transactions'
            })
            .state('settings.security', {
                url: '/security',
                templateUrl: '/views/settings/partials/security.html',
                controller: 'Security',
                controllerAs: 'vm'
            })
            .state('settings.close', {
                url: '/close',
                template: 'close account'
            });
    }

})();
