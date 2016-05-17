/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Controller for the new recipient sub-page of settings
 */
(function () {
    Ctrl.$inject = ["$scope", "$anchorScroll", "$location", "$filter", "$state", "$http", "$stateParams", "Constants", "apiService", "siteAlert", "userSession"];
    angular
        .module('app.account')
        .controller('settingsNewRecipientCtrl', Ctrl);

    /** @ngInject */
    function Ctrl($scope, $anchorScroll, $location, $filter, $state, $http,
                  $stateParams, Constants, apiService, siteAlert, userSession) {

        var userdata = userSession.userdata;
        $scope.recipient = {};
        $scope.save = save;


        $scope.careServices = Constants.careServices;
        $scope.states = Constants.states;

        var saveReq = new HL.CtrlHelper();

        init();
        function init() {
            if ($stateParams.model) {
                $scope.recipient = $stateParams.model;
            }

            $scope.getLocation = function (val) {
                return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
                    params: {
                        address: val,
                        sensor: false
                    }
                }).then(function (response) {
                    return response.data.results.map(function (item) {
                        return {
                            geo: item.geometry.location,
                            label: item.formatted_address
                        };
                    });
                });
            };
        }

        /**
         * Add / Update care recipient.
         * @param model PatientApiModel.
         */
        function save(model) {
            siteAlert.clear();
            model = angular.copy(model);
            if (!validate(model)) {
                return;
            }
            saveReq.success = function (data, status) {
                siteAlert.success('Care recipient saved.');
                $state.go('settings.recipients');

            };
            saveReq.failure = function (data, status) {
                siteAlert.error('Uh-oh, there was a problem with your request.');
            };
            apiService.Accounts.patients.update(model, saveReq);
        }

        var validate = function (model) {
            if (!model.care_type) {
                siteAlert.error("Please select the recipient's care needs.");
                return false;
            }
            if (!model.first || !model.last) {
                siteAlert.error("Please enter the care recipient's name.");
                return false;
            }
            if (!model.address) {
                siteAlert.error("Please enter the care recipient's address.");
                return false;
            }
            if (model.phone_number) {
                if (!HL.helpers.isValidPhone(model.phone_number)) {
                    siteAlert.error('Please enter a valid phone number.');
                    return false;
                }
                // Endpoint expects an integer.
                model.phone_number = model.phone_number.replace(/\D/g, '');
            } else {
                delete model.phone_number;
            }
            if (model.age && !/^\d+$/.test(model.age)) {
                siteAlert.error('Please enter a valid age.');
                return false;
            }
            return true;
        };

    }

})
();