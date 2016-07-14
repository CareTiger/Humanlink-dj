/**
 * Created by venkatesh on 7/12/16.
 */

(function () {
    'use strict';

    NearmeRepo.$inject = ["$q", "$log", "AbstractRepo"];
    angular
        .module('app.repo')
        .factory('NearmeRepo', NearmeRepo);

    /** ngInject */
    function NearmeRepo($q, $log, AbstractRepo) {

        return {
            search: search,
        };


        /**
         * Get Search results.
         * @returns {*}
         */
        function search() {
            return AbstractRepo.get('/nearme/');
        }

    }

})();