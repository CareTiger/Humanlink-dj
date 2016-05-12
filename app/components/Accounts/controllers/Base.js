/**
 * Parent controller of the account module.
 */
(function () {
    'use strict';

    Base.$inject = ["CommonService", "CommonEvents"];
    angular
        .module('app.account')
        .controller('Base', Base);

    /* @ngInject */
    function Base(CommonService, CommonEvents) {
        var vm = this;
        vm.viewReady = false;

        init();

        function init() {
            console.log('Base Init')
            CommonService.on('$stateChangeStart', function () {
                vm.viewReady = false;
            });
            CommonService.on(CommonEvents.viewReady, function () {
                vm.viewReady = true;
            });
        }
    }

})();