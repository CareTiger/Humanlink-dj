/**
 * Account module.
 */
(function () {
    'use strict';

    Config.$inject = ["$stateProvider", "$urlRouterProvider"];
    angular
        .module('app.account', [
            'app.core',
            'app.repo'
        ])
        .config(Config);
    
    // 'ui.bootstrap', 'checklist-model', 'Common'  => see if you need to add these dependencies carried over from other HumanLink Repo.

    /** ngInject */
    function Config($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('account', {
                abstract: true,
                templateUrl: '/static/templates/accounts/partials/main.html',
                controller: 'Base',
                controllerAs: 'base'
            })
            .state('account.edit', {
                url: '/',
                templateUrl: '/static/templates/accounts/partials/edit.html',
                controller: 'Edit',
                controllerAs: 'vm'
            })
            .state('account.team', {
                url: '/team',
                templateUrl: '/static/templates/accounts/partials/team.html',
                controller: 'Team',
                controllerAs: 'vm'
            })
            .state('account.security', {
                url: '/security',
                templateUrl: '/static/templates/accounts/partials/security.html',
                controller: 'Security',
                controllerAs: 'vm'
            })
            .state('reset', {
                url: '/reset',
                templateUrl: '/views/accounts/partials/reset.html',
                controller: 'resetCtrl'
            })
            .state('reset_password', {
                url: '/reset_password',
                templateUrl: '/views/accounts/partials/reset_password.html',
                controller: 'resetPasswordCtrl'
            })
            .state('settings', {
                abstract: true,
                templateUrl: '/static/templates/accounts/partials/settings/base_settings.html'
            })
            .state('settings.profile', {
                url: '/settings/profile',
                templateUrl: '/static/templates/accounts/partials/settings/profile.html',
                controller: 'settingsProfileCtrl'
            })
            .state('settings.connections', {
                url: '/settings/connections',
                templateUrl: '/static/templates/accounts/partials/settings/connections.html',
                controller: 'connectionsCtrl'
            })
            .state('settings.seeker', {
                url: '/settings/seeker',
                templateUrl: '/static/templates/accounts/partials/settings/seeker.html',
                controller: 'settingsSeekerCtrl'
            })
            .state('settings.seeker_preview', {
                url: '/settings/seeker_preview',
                templateUrl: '/static/templates/home/partials/previewSeekerProfile.html',
                controller: 'settingsSeekerCtrl'
            })
            .state('provider', {
                abstract: true,
                templateUrl: '/static/templates/accounts/partials/settings/base_settings_provider.html',
            })
            .state('provider.edit', {
                url: '/settings/provider_edit',
                templateUrl: '/static/templates/accounts/partials/settings/provider.html',
                controller: 'providerEditCtrl'
            })
            .state('provider.preview', {
                url: '/settings/preview',
                templateUrl: '/static/templates/home/partials/previewProviderProfile.html',
                controller: 'providerPreviewCtrl'
            })
            .state('provider.media', {
                url: '/settings/media',
                templateUrl: '/static/templates/accounts/partials/settings/media.html',
                controller: 'settingsMediaCtrl'
            })
            .state('provider.verification', {
                url: '/settings/verification',
                templateUrl: '/static/templates/accounts/partials/settings/verification.html',
                controller: 'settingsVerificationCtrl'
            });
        }
})();