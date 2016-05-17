/**
 * Admin module.
 */
(function () {
    Config.$inject = ["$stateProvider", "$urlRouterProvider"];
    angular
        .module('Admin', [
            'ui.bootstrap',
            'checklist-model',
            'Common'
        ])
        .config(Config);

    /** ngInject */
    function Config($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('admin', {
                abstract: true,
                templateUrl: '/views/admin/partials/base_admin.html',
                data: {
                    // role: userSessionProvider.roles.AUTHORIZED
                }
            })
            .state('admin.verification', {
                url: '/verification',
                templateUrl: '/views/admin/partials/verification.html',
                controller: 'verificationCtrl'
            })
            .state('admin.password', {
                url: '/password',
                templateUrl: '/views/admin/partials/password.html',
                controller: 'passwordCtrl'
            });
    }

})();