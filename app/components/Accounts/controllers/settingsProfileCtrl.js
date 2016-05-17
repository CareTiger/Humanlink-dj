/**
 * Created by timothybaney on 5/16/16.
 */
angular
    .module('app.account')
    .controller('settingsProfileCtrl',
    ['$scope', '$window', '$http',
        function ($scope, $window, $http) {
            // might have to bring back Constants, and userSession as dependency

            // var userdata = userSession.userdata;
            // $scope.usr = userSession;
            // var account_id = $scope.usr.userdata.account_id;
            // var account_email = $scope.usr.userdata.email;

            // Placeholder until initial data is loaded.
            // $scope.account = userdata;
            // $scope.accountForm = angular.copy($scope.account);

            $scope.update = function (model) {
                if (!validate(model)) {
                    return;
                }
                // model = angular.extend(model, {email: account_email});

                $http.post('/post_account_basic', model)
                    .success(function (data, status) {
                        fetch(data, status);
                        $scope.siteAlert.type = "success";
                        $scope.siteAlert.message = "Your basic settings were updated successfully.";
                        //$window.location.reload();
                    })
                    .error(function () {
                        $scope.siteAlert.type = "danger";
                        $scope.siteAlert.message = "Oops. There was a problem. Please try again.";
                    });
            };

            var fetch = function (data, status) {
                // Full-refresh on name change since it is on the navbar.
                if (userdata.first != data.first ||
                    userdata.last != data.last) {
                    $window.location.reload();
                }
                $scope.account = data;
                $scope.accountForm = angular.copy(data);
            };

            var validate = function (model) {
                if (model.phone_number) {
                    if (!HL.helpers.isValidPhone(model.phone_number)) {
                        return false;
                    }
                    // Endpoint expects an integer.
                    model.phone_number = model.phone_number.replace(/\D/g, '');
                }
                return true;
            };

            // var init = function () {
            //     $http({
            //         url: '/get_account_basic',
            //         method: "GET",
            //         // params: {email: account_email}
            //     }).then(function (response) {
            //         $scope.accountForm = response.data;
            //     }, function (response) {
            //         $scope.siteAlert.type = "danger";
            //         $scope.siteAlert.message = ("Oops. " + response.status + " Error. Please try again.");
            //     });
            // };
            // init();
        }]);