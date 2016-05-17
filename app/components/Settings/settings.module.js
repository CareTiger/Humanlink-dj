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

// 'use strict';
//
// /**
//  * Settings module.
//  */
// (function () {
//     Config.$inject = ["$stateProvider", "$urlRouterProvider"];
//     angular
//         .module('Settings', [
//             'ui.bootstrap',
//             'checklist-model',
//             'Common',
//             'stripe'
//         ])
//         .config(Config);
//
//     /** ngInject */
//     function Config($stateProvider, $urlRouterProvider) {
//
//         $urlRouterProvider.otherwise('/');
//
//         $stateProvider
//             .state('settings', {
//                 abstract: true,
//                 templateUrl: '/views/settings/partials/base_settings.html',
//             })
//             .state('settings.security', {
//                 url: '/',
//                 templateUrl: '/views/settings/partials/security.html',
//                 controller: 'securityCtrl'
//             })
//             .state('settings.payments', {
//                 url: '/payments',
//                 templateUrl: '/views/settings/partials/payments.html',
//                 controller: 'paymentsCtrl'
//             })
//             .state('settings.notifications', {
//                 url: '/notifications',
//                 templateUrl: '/views/settings/partials/notifications.html',
//                 controller: 'notificationsCtrl'
//             });
//     }
//
// })();