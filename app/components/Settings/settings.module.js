/**
 * Settings module.
 */
(function () {
    'use strict';

    Config.$inject = ["$locationProvider", "$stateProvider", "$urlRouterProvider"];
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
                        templateUrl: '/static/templates/settings/partials/main.html',
                        controller: 'Base',
                        controllerAs: 'base'
                    },
                    'loader@settings': {
                        templateUrl: '/static/templates/settings/partials/loader.html'
                    }
                }
            })
            .state('settings.notifications', {
                url: '/notifications',
                templateUrl: '/static/templates/settings/partials/notifications.html',
                controller: 'Notifications',
                controllerAs: 'vm'
            })
            .state('settings.payments', {
                url: '/payments',
                templateUrl: '/static/templates/settings/partials/payments.html',
                controller: 'Payments',
                controllerAs: 'vm'
            })
            .state('settings.transactions', {
                url: '/transactions',
                template: 'transactions'
            })
            .state('settings.security', {
                url: '/security',
                templateUrl: '/static/templates/accounts/partials/security.html',
                controller: 'Security',
                controllerAs: 'vm'
            })
            .state('settings.close', {
                url: '/close',
                template: 'close account'
            });
    }

})();