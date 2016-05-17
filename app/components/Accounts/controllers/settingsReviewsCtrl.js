/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Controller for the reviews subpage of settings
 */
angular
    .module('app.account')
    .controller('settingsReviewsCtrl', ['$scope', function ($scope) {
        $scope.getReviews = function () {
            $scope.reviews = [
                {
                    title: 'Fantastic Caregiver',
                    body: 'Lorem ipsum dolor sit amet, soleat principes persecuti ea vim, nec debitis deleniti expetendis ei, sit an stet vero dissentias. Ad nam tation mnesarchum argumentum, velit hendrerit suscipiantur ne vel. At eos referrentur deterruisset. Eam an simul oratio moderatius, an meis voluptatibus mei. Mei ad soleat adolescens scriptorem, no nobis alienum quo.',
                    rating: 4
                },
                {
                    title: 'Totally Amazing',
                    body: 'Lorem ipsum dolor sit amet, soleat principes persecuti ea vim, nec debitis deleniti expetendis ei, sit an stet vero dissentias. Ad nam tation mnesarchum argumentum, velit hendrerit suscipiantur ne vel. At eos referrentur deterruisset. Eam an simul oratio moderatius, an meis voluptatibus mei. Mei ad soleat adolescens scriptorem, no nobis alienum quo.',
                    rating: 5
                },
                {
                    title: 'Always Showed Up On Time',
                    body: 'Lorem ipsum dolor sit amet, soleat principes persecuti ea vim, nec debitis deleniti expetendis ei, sit an stet vero dissentias. Ad nam tation mnesarchum argumentum, velit hendrerit suscipiantur ne vel. At eos referrentur deterruisset. Eam an simul oratio moderatius, an meis voluptatibus mei. Mei ad soleat adolescens scriptorem, no nobis alienum quo.',
                    rating: 5
                },
                {
                    title: 'So-So',
                    body: 'Lorem ipsum dolor sit amet, soleat principes persecuti ea vim, nec debitis deleniti expetendis ei, sit an stet vero dissentias. Ad nam tation mnesarchum argumentum, velit hendrerit suscipiantur ne vel. At eos referrentur deterruisset. Eam an simul oratio moderatius, an meis voluptatibus mei. Mei ad soleat adolescens scriptorem, no nobis alienum quo.',
                    rating: 2
                },
            ];
        };

        $scope.getReviews();
    }]);