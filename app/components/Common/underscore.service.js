/**
 * Underscore.js wrapper as a factory.
 * Docs: http://underscorejs.org/
 */
(function () {
    'use strict';

    Underscore.$inject = ["$window"];
    angular
        .module('app.common')
        .factory('underscore', Underscore);

    /** ngInject */
    function Underscore($window) {

        return $window._;

    }

})();