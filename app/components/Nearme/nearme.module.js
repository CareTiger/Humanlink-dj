/**
 * Nearme module.
 */

(function () {
    'use strict';

    Config.$inject = ["$locationProvider", "$stateProvider", "$urlRouterProvider"];
    angular
        .module('app.nearme', [
            'app.core',
            'app.repo'
        ])
        .config(Config);

    /** ngInject */
    function Config($locationProvider, $stateProvider, $urlRouterProvider) {

        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('nearme', {
                abstract: true,
                views: {
                    '': {
                        templateUrl: '/static/templates/nearme/partials/main.html',
                        controller: 'Base',
                        controllerAs: 'base'
                    },
                    'loader@nearme': {
                        templateUrl: '/static/templates/nearme/partials/loader.html'
                    }
                }
            })
            .state('nearme.search', {
                url: '/',
                templateUrl: '/static/templates/nearme/partials/search.html',
                controller: 'Nearme',
                controllerAs: 'vm'
            });
    }

})();
