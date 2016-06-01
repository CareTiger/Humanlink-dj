/**
 * Guest module.
 */
(function () {
    'use strict';

    Config.$inject = ["$locationProvider", "$stateProvider", "$urlRouterProvider", "$httpProvider"];
    angular
        .module('app.guest', [
            'app.common',
            'app.core',
            'app.repo',
            'ui.bootstrap',
            'ngCookies',
        ])
        .config(Config)
        .run(['$http', '$cookies', function ($http, $cookies) {
            // set the CSRF token here
            $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
        }])

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
            .state('auth.search', {
                url: '/search',
                templateUrl: '/static/templates/home/partials/search.html',
                controller: 'searchCtrl'
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
            .state('auth.faq', {
                url: '/faq',
                templateUrl: '/static/templates/home/partials/faq.html',
                controller: 'faqCtrl'
            })
            .state('auth.previewProviderProfile', {
                url: '/previewProviderProfile/:account_id',
                templateUrl: '/static/templates/home/partials/previewProviderProfile.html',
                controller: 'previewProviderProfileCtrl'
            })
            .state('auth.previewSeekerProfile', {
                url: '/previewSeekerProfile/:account_id',
                templateUrl: '/static/templates/home/partials/previewSeekerProfile.html',
                controller: 'previewSeekerProfileCtrl'
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
            })
            .state('auth.threadAccept', {
                    url: '/thread/{token}/?data',
                    views: {
                        '': {
                            templateUrl: '/static/templates/home/partials/thread/thread.accept.html',
                            controller: 'ThreadAccept',
                            controllerAs: 'vm',
                            reloadOnSearch: false
                        },
                        'signup@auth.threadAccept': {
                            templateUrl: '/static/templates/home/partials/thread/thread.accept.signup.html'
                        },
                        'login@auth.threadAccept': {
                            templateUrl: '/static/templates/home/partials/thread/thread.accept.login.html'
                        },
                    }
                });

        /** ngInject */
        function broadcastReady(CommonService, CommonEvents) {
            CommonService.broadcast(CommonEvents.viewReady);
        }
    }

})();