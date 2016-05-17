/**
 * Created by timothybaney on 5/16/16.
 */

/**
 * Keeps track of the current logged in user.
 */
(function () {
    angular
        .module('Common')
        .provider('userSession', function () {

            getUserSession.$inject = ["apiService"];
            var roles = {
                GUEST: 0,
                AUTHORIZED: 1
            };

            return {
                // This is here because it us used in `angular.config()`.
                roles: roles,
                $get: getUserSession
            };

            /** ngInject */
            function getUserSession(apiService) {
                var userdata = null;
                var ctrlHelper = new HL.CtrlHelper();

                // Initial page load.
                if (window.HL.userdata) {
                    userdata = window.HL.userdata;
                }

                return {
                    roles: roles,
                    userdata: userdata,
                    setAccount: setAccount,
                    unsetAccount: unsetAccount,
                    isAuthorized: isAuthorized,
                    update: update,
                    getRole: getRole
                };

                function setAccount(account) {
                    userdata = account;
                }

                function unsetAccount() {
                    userdata = null;
                }

                function isAuthorized() {
                    return userdata !== null;
                }

                function update() {
                    ctrlHelper.success = function (data, status, headers, config) {
                        userdata = data;
                    };
                    ctrlHelper.error = function () {
                        unsetAccount();
                    };
                    apiService.Accounts.userdata({}, ctrlHelper);
                }

                /**
                 * Returns roles.GUEST or roles.AUTHORIZED.
                 * In the future, this should be used for checking account type as well.
                 */
                function getRole() {
                    return isAuthorized() ? roles.AUTHORIZED : roles.GUEST;
                }
            }
        });

})();