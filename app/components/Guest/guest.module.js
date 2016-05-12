/**
 * Guest module.
 */
(function () {
    'use strict';

    Config.$inject = ["$locationProvider", "$stateProvider", "$urlRouterProvider", "$httpProvider"];
    angular
        .module('app.guest', [
            'app.core',
            'app.repo'
        ])
        .config(Config);

    /** ngInject */
    function Config($locationProvider, $stateProvider, $urlRouterProvider, $httpProvider) {

        broadcastReady.$inject = ["CommonService", "CommonEvents"];
        $locationProvider.html5Mode(true);
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('auth', {
                abstract: true,
                templateUrl: '/static/templates/home/partials/auth/main.html',
                controller: 'Auth',
                controllerAs: 'auth'
            })
            .state('auth.login', {
                url: '/login?next',
                templateUrl: '/static/templates/home/partials/auth/login.html',
                controller: 'Login',
                controllerAs: 'vm'
            })
            .state('auth.reset', {
                url: '/reset',
                template: "<div class='card card-half'>This screen is not yet ready. ¯\\_(ツ)_/¯</div>",
                controller: broadcastReady
            })
            .state('auth.join', {
                abstract: true,
                templateUrl: '/static/templates/home/partials/auth/join.html',
                controller: 'Join',
                controllerAs: 'vm'
            })
            .state('auth.join.personal', {
                url: '/join?invite',
                templateUrl: '/static/templates/home/partials/auth/join.personal.html',
                controller: broadcastReady
            })
            .state('auth.join.team', {
                templateUrl: '/static/templates/home/partials/auth/join.team.html',
                controller: broadcastReady
            })
            .state('auth.accept', {
                url: '/accept/{token}/?data',
                views: {
                    '': {
                        templateUrl: '/static/templates/home/partials/auth/accept.html',
                        controller: 'Accept',
                        controllerAs: 'vm',
                        reloadOnSearch: false
                    },
                    'signup@auth.accept': {
                        templateUrl: '/static/templates/home/partials/auth/accept.signup.html'
                    },
                    'login@auth.accept': {
                        templateUrl: '/static/templates/home/partials/auth/accept.login.html'
                    }
                }
            });

        /** ngInject */
        function broadcastReady(CommonService, CommonEvents) {
            CommonService.broadcast(CommonEvents.viewReady);
        }
    }

})();