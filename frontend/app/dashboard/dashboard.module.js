/**
 * Dashboard module.
 */
(function () {
    'use strict';

    angular
        .module('app.dashboard', [
            'app.core',
            'app.repo',
            'app.dashboard.team',
            'app.dashboard.thread'
        ])
        .config(Config)
        .run(Run);

    /** ngInject */
    function Config($locationProvider, $stateProvider, $urlRouterProvider) {

        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('dashboard', {
                abstract: true,
                url: '/',
                views: {
                    'sidebar': {
                        templateUrl: '/views/dashboard/partials/sidebar.html',
                        controller: 'Sidebar',
                        controllerAs: 'sidebar'
                    },
                    '': {
                        template: '<div ui-view></div>',
                        controller: 'Base',
                        controllerAs: 'base'
                    }
                },
                resolve: {
                    ready: rootResolve
                }
            })
            .state('dashboard.default', {
                url: '',
                templateUrl: '/views/dashboard/partials/welcome.html',
                controller: 'Welcome',
                controllerAs: 'vm',
                resolve: { title: function () { return 'Dashboard';} }
            })
            .state('dashboard.new_thread', {
                url: 'new',
                templateUrl: '/views/dashboard/partials/create.html',
                controller: 'CreateThread',
                controllerAs: 'vm',
                resolve: { title: function () { return 'Create Channel';} }
            })
            .state('state-error', {
                templateUrl: '/views/dashboard/partials/state-error.html',
                params: {error: null},
                controller: /** ngInject */ function ($stateParams) {
                    var vm = this;
                    vm.error = $stateParams.error;
                    vm.showError = false;
                },
                controllerAs: 'vm',
                resolve: { title: function () { return 'Error!!!';} }
            })
    }

    /** ngInject */
    function Run($rootScope, $log, $state, MessageFormatter) {
        $rootScope.$on('$stateChangeError',
            function (event, toState, toParams, fromState, fromParams, error) {
                event.preventDefault();
                $log.error('Could not bootstrap dashboard.');
                $state.go('state-error', {error: error});
            });

        // Register formatters that are used for rendering message body.
        MessageFormatter.formatters.push(hl.markdown);
    }

    /** ngInject */
    function rootResolve(DashboardHelper) {
        return DashboardHelper.initialize();
    }


})();
