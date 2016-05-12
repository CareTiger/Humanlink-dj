
/**
 * Base controller of the auth state.
 */
(function () {
    'use strict';

    Auth.$inject = ["CommonService", "CommonEvents"];
    angular
        .module('app.guest')
        .controller('Auth', Auth);

    /** @ngInject */
    function Auth(CommonService, CommonEvents) {
        var vm = this;
        vm.viewReady = false;

        init();

        function init() {
            CommonService.on('$stateChangeStart', function () {
                vm.viewReady = false;
            });
            CommonService.on(CommonEvents.viewReady, function () {
                vm.viewReady = true;
            });
        }
    }

})();