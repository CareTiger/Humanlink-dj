/**
 * Humanlink helper methods.
 * Accessible via `window.hl`.
 */
(function () {
    'use strict';

    window.hl = window.hl || {};
    var hl = window.hl;

    /**
     * Returns whether or not the host is production.
     * @return {boolean}
     */
    hl.isProd = function () {
        var h = window.location.host;
        return (h.indexOf('humanlink.co') === 0 ||
                h.indexOf('humanlink-frontend.appspot.com') === 0);
    };

    /**
     * Returns whether the given phone number is in a valid format.
     * Valid formats: ###-###-#### or ten digits.
     */
    hl.isValidPhone = function (phone) {
        var re1 = /^\d{10}$/;
        var re2 = /^\d{3}-\d{3}-\d{4}$/;
        return re1.test(phone) || re2.test(phone);
    };

    /**
     * Returns whether the given email address is in a valid format.
     */
    hl.isValidEmail = function (email) {
        var re = /^[^@]+@[^@.]+\.[^@]+$/;
        return re.test(email);
    };

})();