/**
 * Parent controller of the settings module.
 */
(function () {
    'use strict';

    Base.$inject = ["CommonService", "CommonEvents"];
    angular
        .module('app.settings')
        .controller('Base', Base);

    /* @ngInject */
    function Base(CommonService, CommonEvents) {
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