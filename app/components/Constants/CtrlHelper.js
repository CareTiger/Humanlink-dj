/**
 * Created by timothybaney on 5/16/16.
 */
'use strict';

window.HL = window.HL || {};
/**
 * Set HL.CtrlHelper.
 *
 * HL.CtrlHelper keeps track of the controller's current status
 * as well as callbacks for talking to the server via apiService.
 */
(function (obj) {
    var ctrlHelper = function () {
        var self = this;

        // Default callback that is called regardless of $http response status.
        self.always = null;

        // Default callback that is called on $http success status.
        self.success = function (data, status, headers, config) {
            self.isLoading = false;
        };

        // Default callback that is called on $http error status.
        self.failure = function (data, status, headers, config) {
            self.isLoading = false;
            self.isValid = false;
            self.errors = [data.error_message];
        };

        self.reset = function () {
            self.isLoading = false;
            self.isValid = true;
            self.errors = [];
        };

        // Initialize.
        self.reset();

        return self;
    };
    obj.CtrlHelper = ctrlHelper;
}(window.HL));

/**
 * Set HL.baseUrl.
 *
 * HL.baseUrl is base URL of the website.
 */
(function (obj) {
    // Simulates window.location.origin as it is not supported by all browsers.
    var locationOrigin = function () {
        return window.location.protocol + '//' + window.location.host;
    };
    obj.baseUrl = locationOrigin();
}(window.HL));