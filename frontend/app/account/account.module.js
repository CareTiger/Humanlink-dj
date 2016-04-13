/**
 * Account module.
 */
(function () {
    'use strict';

    angular
        .module('app.account', [
            'app.core',
            'app.repo'
        ])
        .config(Config);

    /** ngInject */
    function Config($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/edit');

        $stateProvider
            .state('account', {
                abstract: true,
                templateUrl: '/views/accounts/partials/main.html',
                controller: 'Base',
                controllerAs: 'base'
            })
            .state('account.edit', {
                url: '/edit',
                templateUrl: '/views/accounts/partials/edit.html',
                controller: 'Edit',
                controllerAs: 'vm'
            })
            .state('account.security', {
                url: '/security',
                templateUrl: '/views/accounts/partials/security.html',
                controller: 'Security',
                controllerAs: 'vm'
            });
    }
})();
