(function () {
    'use strict';

    hlResizeMessages.$inject = ["$window"];
    angular
        .module('app.dashboard.thread')
        .directive('hlResizeMessages', hlResizeMessages);

    /**
     * When `hl-resize-messages` is added to the messages view, this directive
     * watches for window resize and appropriately adjusts the element height.
     *
     * Example usage:
     * <div hl-resize style="min-height: 100px"></div>
     *
     * Try resizing the window the see the effect.
     */
    /** ngInject */
    function hlResizeMessages($window) {
        var w = angular.element($window);
        // Make sure to keep these in sync.
        var headerHeight = 45;
        var textareaHeight = 70;

        // Directive link.
        return function (scope, elem) {
            var minHeight = elem.css('min-height') || 0;

            w.bind('resize', update);

            // Page load.
            update();

            function update() {
                var origHeight = elem[0].scrollHeight;
                var origPos = elem[0].scrollTop + elem[0].offsetHeight;

                var height = w.height - (headerHeight + textareaHeight);
                if (height < minHeight) {
                    height = minHeight;
                }

                elem.css('height', (height) + 'px');

                // Scroll to bottom if it was at the bottom before.
                if (origHeight <= (origPos + 20)) {
                    $(elem).scrollTop(elem[0].scrollHeight);
                }
            }
        }
    }

    angular
        .module('app.dashboard.thread')
        .run(function ($rootScope) {
            $rootScope.model = {id: 2};
        })
        .directive('convertToNumber', function () {
            return {
                require: 'ngModel',
                link: function (scope, element, attrs, ngModel) {
                    ngModel.$parsers.push(function (val) {
                        return parseInt(val, 10);
                    });
                    ngModel.$formatters.push(function (val) {
                        return '' + val;
                    });
                }
            };
        });
})();