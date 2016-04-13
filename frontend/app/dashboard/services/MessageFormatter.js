/**
 * Provides an interface to register thread message formatters such
 * as markdown, autolinks, mentions, URL previews, etc.
 */
(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .factory('MessageFormatter', MessageFormatter);

    /** ngInject */
    function MessageFormatter() {

        var fact = {};

        /**
         * Array of functions to execute whenever the `run` method is called.
         * The functions are called in array order, each passing its return
         * value through to the next.
         */
        fact.formatters = [];
        fact.run = run;

        return fact;

        function run(value) {
            fact.formatters.forEach(function (fmt) {
                value = fmt(value);
            });
            return value;
        }

    }

})();
