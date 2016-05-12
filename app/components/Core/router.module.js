/**
 * UI Router wrapper and helpers.
 */
(function () {
    'use strict';

    Run.$inject = ["$log", "$rootScope", "$window", "$state"];
    angular
        .module('app.router', [])
        .run(Run);

    /** ngInject */
    function Run($log, $rootScope, $window, $state) {
        onStateChange();

        /**
         * Sets the page title on a state transition.
         * The page is customized to Humanlink.
         *
         * Usage:
         *   Include a `title` property in the state's resolve object.
         *
         *   $stateProvider.state('parent', {
         *       resolve: {title: function () { return 'constant'; }}
         *   })
         *   $stateProvider.state('parent.child', {
         *       resolve: {title: function (SomeService) {
         *          return SomeService.stuff();
         *      }}
         *   })
         */
        function onStateChange() {
            $log.debug('app.router: onStateChange');
            $rootScope.$on('$stateChangeSuccess', function () {
                var title = 'Humanlink';
                var resTitle = $state.$current.locals.globals.title;
                if (angular.isString(resTitle)) {
                    title = resTitle + ' | Humanlink';
                }
                $window.document.title = title;
            });
        }
    }

})();