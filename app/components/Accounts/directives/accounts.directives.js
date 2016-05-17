/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';
/**
 * Caregiver professional credentials template.
 */
angular
    .module('app.account')
    .directive('hlProfessionalCredentials', function () {
        return {
            restrict: 'E',
            templateUrl: '/views/accounts/partials/dir/caregiver_professional_credentials.html'
        };
    });

/**
 * Caregiver Status and Description template.
 */
angular
    .module('app.account')
    .directive('hlDescriptionStatus', function () {
        return {
            restrict: 'E',
            templateUrl: '/views/accounts/partials/dir/caregiver_description_status.html'
        };
    });

/**
 * Caregiver professional preferences template.
 */
angular
    .module('app.account')
    .directive('hlProfessionalPreferences', function () {
        return {
            restrict: 'E',
            templateUrl: '/views/accounts/partials/dir/caregiver_professional_preferences.html'
        };
    });

/**
 * Caregiver skills template.
 */
angular
    .module('app.account')
    .directive('hlSkills', function () {
        return {
            restrict: 'E',
            templateUrl: '/views/accounts/partials/dir/caregiver_skills.html'
        };
    });

/**
 * Caregiver additional information template.
 */
angular
    .module('app.account')
    .directive('hlAdditionalInformation', function () {
        return {
            restrict: 'E',
            templateUrl: '/views/accounts/partials/dir/caregiver_additional_information.html'
        };
    });

/**
 * Caregiver add certification template.
 */
angular
    .module('app.account')
    .directive('hlAddCertification', function () {
        return {
            restrict: 'E',
            templateUrl: '/views/accounts/partials/dir/caregiver_add_certification.html'
        };
    });

/**
 * Caregiver add experience template.
 */
angular
    .module('app.account')
    .directive('hlAddExperience', function () {
        return {
            restrict: 'E',
            templateUrl: '/views/accounts/partials/dir/caregiver_add_experience.html'
        };
    });

/**
 * Caregiver add emergency template.
 */
angular
    .module('app.account')
    .directive('hlAddEmergency', function () {
        return {
            restrict: 'E',
            templateUrl: '/views/accounts/partials/dir/caregiver_add_emergency.html'
        };
    });

/**
 * Caregiver add languages template.
 */
angular
    .module('app.account')
    .directive('hlAddLanguage', function () {
        return {
            restrict: 'E',
            templateUrl: '/views/accounts/partials/dir/caregiver_add_language.html'
        };
    });

/**
 * Caregiver add license template.
 */
angular
    .module('app.account')
    .directive('hlAddLicense', function () {
        return {
            restrict: 'E',
            templateUrl: '/views/accounts/partials/dir/caregiver_add_license.html'
        };
    });