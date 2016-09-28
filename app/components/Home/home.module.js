Config.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider",
		 		  "$urlMatcherFactoryProvider", "$httpProvider"];
var home = angular.module('Home', ['ui.router']).config(Config)

function Config($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/static/templates/home/partials/home.html',
                controller: 'homeBaseCtrl'
            })
            .state('caregiver', {
                url: '/caregiver',
                templateUrl: '/static/templates/home/partials/caregiver.html',
                controller: 'caregiverCtrl'
            })
            .state('search', {
                url: '/search',
                templateUrl: '/static/templates/home/partials/search.html',
                controller: 'searchCtrl'
            })
            .state('contact', {
                url: '/contact',
                templateUrl: '/static/templates/home/partials/contact.html',
                controller: 'contactCtrl'
            })
            .state('faq', {
                url: '/faq',
                templateUrl: '/static/templates/home/partials/faq.html',
                controller: 'faqCtrl'
            })
            .state('previewProviderProfile', {
                url: '/previewProviderProfile/:account_id',
                templateUrl: '/static/templates/home/partials/previewProviderProfile.html',
                controller: 'previewProviderProfileCtrl'
            })
            .state('previewSeekerProfile', {
                url: '/previewSeekerProfile/:account_id',
                templateUrl: '/static/templates/home/partials/previewSeekerProfile.html',
                controller: 'previewSeekerProfileCtrl'
            })
            .state('careseeker', {
                url: '/careseeker',
                templateUrl: '/static/templates/home/partials/careseeker.html',
                controller: 'careseekerCtrl'
            })
            .state('aboutus', {
                url: '/aboutus',
                templateUrl: '/static/templates/home/partials/about_us.html',
                controller: 'aboutusCtrl'
            })
            .state('terms', {
                url: '/terms',
                templateUrl: '/static/templates/home/partials/terms.html',
                controller: 'termsCtrl'
            })
            .state('privacy', {
                url: '/privacy',
                templateUrl: '/static/templates/home/partials/privacy.html',
                controller: 'privacyCtrl'
            })
            .state('press', {
                url: '/press',
                templateUrl: '/static/templates/home/partials/press.html',
                controller: 'pressCtrl'
            })
            .state('interest', {
                url: '/interest',
                templateUrl: '/static/templates/home/partials/interest.html',
                controller: 'interestCtrl'
            })
            .state('pricing', {
                url: '/pricing',
                templateUrl: '/static/templates/home/partials/pricing.html',
                controller: 'pricingCtrl'
            });
}