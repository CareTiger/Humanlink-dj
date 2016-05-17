/**
 * Created by timothybaney on 5/16/16.
 */
window.HL = window.HL || {};

window.HL.helpers = {
    /**
     * Returns whether or not the host is in production.
     */
    isProd: function () {
        var h = window.location.host;
        return (h.indexOf('humanlink.co') === 0 ||
        h.indexOf('care-tiger.appspot.com') === 0);
    },

    /**
     * Returns whether the given phone number is in a valid format.
     * Valid formats: ###-###-#### or ten digits.
     */
    isValidPhone: function (phone) {
        var re1 = /^\d{10}$/;
        var re2 = /^\d{3}-\d{3}-\d{4}$/;
        return re1.test(phone) || re2.test(phone);
    },

    /**
     * Returns whether the given email address is in a valid format.
     */
    isValidEmail: function (email) {
        var re = /^[^@]+@[^@.]+\.[^@]+$/;
        return re.test(email);
    },

    /**
     * Returns whether the given credit card number is in a valid format.
     */
    isValidCard: function (card) {
        var re1 = /^\d{16}$/;
        var re2 = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
        return re1.test(card) || re2.test(card);
    }

};