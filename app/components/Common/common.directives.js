(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('hlAlphanum', hlAlphanum)
        .directive('hlCapitalize', hlCapitalize)
        .directive('hlFocus', hlFocus)
        .directive('hlPreload', hlPreload)
        .directive('hlSelectBoolean', hlSelectBoolean)
        .directive('hlCompareTo', hlCompareTo)
        .directive('hlPhoneNumber', hlPhoneNumber);


    /**
     * Adds a `alphanum` $validator to ngModel.
     * Example usage:
     *   <input name="field" hl-alphanum />
     *   {{ form.field.$error.alphanum }}
     */
    function hlAlphanum() {
        return {
            require: 'ngModel',
            link: /** ngInject */ function (scope, elem, attr, ngModel) {
                var re = /^[\w-]+$/;

                ngModel.$validators.alphanum = function (value) {
                    return re.test(value);
                }
            }
        }
    }

    /**
     * Capitalizes the first letter in a ngModel.
     * Example usage:
     *   <input ng-model="field" hl-capitalize />
     *   {{ field }}
     */
    function hlCapitalize() {
        return {
            require: 'ngModel',
            link: /** ngInject */ function (scope, elem, attr, ngModel) {

                ngModel.$parsers.push(function (value) {
                    if (!angular.isDefined(value)) {
                        return;
                    }
                    var first = value.charAt(0).toUpperCase();
                    // First letter is already uppercase.
                    if (value.charAt(0) === first) {
                        return value;
                    }
                    var cap = first + (value.length > 1 ? value.substring(1) : '');
                    ngModel.$setViewValue(cap);
                    ngModel.$render();
                    return cap;
                });

            }
        }
    }

    /**
     * Sets focus on the element.
     * Example usage:
     *   <input type="text" hl-focus />
     *   The input will be auto focused when view loads.
     */
    function hlFocus() {
        return {
            link: function (scope, element) {
                element[0].focus();
            }
        };
    }

    /**
     * Attaches some data to the current scope.
     * Example:
     *   <hl-preload hl-key="foo" hl-value='{"a": "z", "b": [1, 2]}'></<hl-preload>
     *   This results in the current $scope to have a "foo" property with the
     *   given JSON value in hl-value.
     */
    function hlPreload() {
        return {
            restrict: 'E',
            link: function (scope, element, attrs) {
                scope[attrs.hlKey] = JSON.parse(attrs.hlValue);
                element.remove();
            }
        };
    }

    /**
     * Selects a boolean in <select> options.
     * This is to fix an AngularJS problem:
     *     https://github.com/angular/angular.js/issues/6297
     */
    function hlSelectBoolean() {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function (value) {
                    if (value === 'true' || value === 'false') {
                        return value === 'true';
                    }
                    return null;
                });
                ngModel.$formatters.push(function (value) {
                    if (typeof(value) === 'boolean') {
                        return value ? 'true' : 'false';
                    }
                    return '';
                });
            }
        };
    }

    /**
     * Adds a `compareTo` $validator to ngModel.
     * Example usage:
     *   <input name="field" hl-compare-to="otherModel" />
     *   {{ form.field.$error.compareTo }}
     */
    function hlCompareTo() {
        return {
            require: 'ngModel',
            scope: {
                other: '=hlCompareTo'
            },
            link: /** ngInject */ function (scope, elem, attr, ngModel) {
                ngModel.$validators.compareTo = function (value) {
                    return value === scope.other;
                };

                scope.$watch('other', function () {
                    ngModel.$validate();
                });
            }
        };
    }

    /**
     * Adds a `phoneNumber` $validator to ngModel.
     * Example usage:
     *   <input name="field" hl-phone-number />
     *   {{ form.field.$error.phoneNumber }}
     */
    function hlPhoneNumber() {
        return {
            require: 'ngModel',
            link: /** ngInject */ function (scope, elem, attr, ngModel) {
                ngModel.$validators.phoneNumber = function (value) {
                    return hl.isValidPhone(value);
                }
            }
        }
    }

})();

/**
 * Set focus on the element.
 * Example:
 *   <input type="text" hl-focus />
 */
angular
    .module('Common')
    .directive('hlFocus', function () {
        return {
            link: function (scope, element) {
                element[0].focus();
            }
        };
    });

/**
 * Attaches some data to the current scope.
 * Example:
 *   <hl-preload hl-key="foo" hl-value='{"a": "z", "b": [1, 2]}'></<hl-preload>
 *   will result in the current $scope to have a "foo" property with the
 *   given JSON value in hl-value.
 */
angular
    .module('Common')
    .directive('hlPreload', function () {
        return {
            restrict: 'E',
            link: function (scope, element, attrs) {
                scope[attrs.hlKey] = JSON.parse(attrs.hlValue);
                element.remove();
            }
        };
    });


/**
 * Selects a boolean in <select> options.
 * This is to fix an AngularJS problem:
 *     https://github.com/angular/angular.js/issues/6297
 */
angular
    .module('Common')
    .directive('hlSelectBoolean', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function (value) {
                    if (value === 'true' || value === 'false') {
                        return value === 'true';
                    }
                    return null;
                });
                ngModel.$formatters.push(function (value) {
                    if (typeof(value) === 'boolean') {
                        return value ? 'true' : 'false';
                    }
                    return '';
                });
            }
        };
    });