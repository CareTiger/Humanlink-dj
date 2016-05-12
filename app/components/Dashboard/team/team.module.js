/**
 * Team management and settings module.
 */
(function () {
    'use strict';

    Config.$inject = ["$stateProvider"];
    orgInfoResolve.$inject = ["ready", "$stateParams", "$q", "OrgService"];
    angular
        .module('app.dashboard.team', [])
        .config(Config);

    /** ngInject */
    function Config($stateProvider) {

        $stateProvider
            .state('dashboard.team', {
                abstract: true,
                url: 'manage/{org}',
                templateUrl: '/static/templates/dashboard/partials/team/main.html',
                controller: 'Team',
                controllerAs: 'vm',
                resolve: {
                    orgInfo: orgInfoResolve
                }
            })
            .state('dashboard.team.directory', {
                url: '',
                templateUrl: '/static/templates/dashboard/partials/team/directory.html',
                controller: 'Directory',
                controllerAs: 'vm'
            })
            .state('dashboard.team.invite', {
                url: '/invite',
                templateUrl: '/static/templates/dashboard/partials/team/invite.html',
                controller: 'OrgInvite',
                controllerAs: 'vm'
            });
    }

    /**
     * Org info resolved dependency that can be injected into the controllers.
     * @param ready: (required) wait for the dashboard `ready` to resolve.
     * @return {Promise}
     */
    /** ngInject */
    function orgInfoResolve(ready, $stateParams, $q, OrgService) {
        if (!$stateParams.org) {
            return $q.reject('Invalid team.');
        }
        return OrgService.getOrgByUsername($stateParams.org);
    }

})();