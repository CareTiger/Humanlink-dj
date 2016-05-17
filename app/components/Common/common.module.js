/**
 * A module that has common directives, services, constants, etc.
 */
(function () {
    'use strict';

    angular.module('app.common', []);

})();

'use strict';

/**
 * A module that is common to all other site modules.
 */
(function () {
    Run.$inject = ["$rootScope", "$location", "$state", "userSession"];
    Config.$inject = ["$compileProvider"];
    Ctrl.$inject = ["$scope"];
    angular
        .module('Common', ['ui.router'])
        .run(Run)
        .config(Config)
        .controller('commonCtrl', Ctrl);

    /** @ngInject */
    function Run($rootScope, $location, $state, userSession) {
        // Broadcasted when the state of the module changes.
        $rootScope.$on('$stateChangeStart', stateChangeStartListener);

        // siteAlert is global.
        $rootScope.siteAlert = {};

        function stateChangeStartListener(e, toState, toParams, fromState, fromParams) {
            if (toState.data && angular.isDefined(toState.data.role)) {
                var accessRole = toState.data.role;
                var userRole = userSession.getRole();
                // Guest is redirected account page.
                if (accessRole === userSession.roles.GUEST && userRole !== accessRole) {
                    e.preventDefault();
                    $state.go('settings.profile');
                    return;
                }
                // User is redirected to login.
                if (accessRole === userSession.roles.AUTHORIZED && userRole !== accessRole) {
                    e.preventDefault();
                    $state.go('login',
                        {next: $location.absUrl()},
                        {notify: false}
                    );
                    return;
                }
            }
            // No need to update userSession on page load.
            if (!fromState.abstract) {
                userSession.update();
            }
        }
    }

    /** @ngInject */
    function Config($compileProvider) {
        if (HL.helpers.isProd()) {
            $compileProvider.debugInfoEnabled(false);
        }
    }

    /** @ngInject */
    function Ctrl($scope) {
        // Empty.
    }

})();