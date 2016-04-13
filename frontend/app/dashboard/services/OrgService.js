/**
 * Various helper methods for working with orgs and org members.
 */
(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .factory('OrgService', OrgService);

    /** @ngInject */
    function OrgService($q, underscore, OrgsRepo, Session) {

        var cache = {
            orgs: null,
            allThreads: {},
            allMembers: {}
        };

        return {
            cache: cache,
            getSummary: getSummary,
            getOrgByUsername: getOrgByUsername
        };

        /**
         * Gets org summary.
         *
         * @return {Promise}
         */
        function getSummary() {
            if (cache.orgs) {
                return $q.when(cache.orgs);
            }
            return OrgsRepo.fetchSummary().then(function (orgs) {
                orgs.forEach(butter);
                cache.orgs = orgs;
                return cache.orgs;
            });

            function butter(org) {
                if (org.members) {
                    org.membersIndexed = underscore.indexBy(org.members, 'id');
                    angular.extend(cache.allMembers, org.membersIndexed);
                }
                if (org.threads) {
                    org.threads = underscore.sortBy(org.threads, 'name');
                    org.threadsIndexed = underscore.indexBy(org.threads, 'id');
                    angular.extend(cache.allThreads, org.threadsIndexed);
                }
                return org;
            }
        }

        /**
         * Returns an org by username.
         * @param username
         * @return {Promise}
         */
        function getOrgByUsername(username) {
            return getSummary().then(function (orgs) {
                return underscore.findWhere(orgs, {username: username});
            });
        }

    }

})();
