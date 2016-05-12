/**
 * Core module that bootstrap most of the dependencies and configuration.
 */
(function () {
    'use strict';

    Config.$inject = ["$compileProvider", "$logProvider"];
    angular
        .module('app.core', [
            'ngAnimate',
            'ngMessages',
            'ui.router',
            'ui.bootstrap',
            'app.common',
            'app.router',
            'templates',
        ])
        .config(Config);

    /** ngInject */
    function Config($compileProvider, $logProvider) {
        if (hl.isProd()) {
            $compileProvider.debugInfoEnabled(false);
            $logProvider.debugEnabled(false);
        }
    }

    (function () {
        'use strict';

        angular
            .module('templates', [])
    })();

})();