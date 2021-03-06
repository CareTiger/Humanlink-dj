/**
 * Account module.
 */
(function () {
    'use strict';

    Config.$inject = ["$stateProvider", "$urlRouterProvider"];
    angular
        .module('app.account', [
            'app.core',
            'app.repo'
        ])
        .config(Config);

    // 'ui.bootstrap', 'checklist-model', 'Common'  => see if you need to add these dependencies carried over from other HumanLink Repo.

    /** ngInject */
    function Config($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('account', {
                abstract: true,
                templateUrl: '/static/templates/accounts/partials/main.html',
                controller: 'Base',
                controllerAs: 'base'
            })
            .state('account.edit', {
                url: '/',
                templateUrl: '/static/templates/accounts/partials/edit.html',
                controller: 'Edit',
                controllerAs: 'vm'
            })
            .state('account.team', {
                url: '/team',
                templateUrl: '/static/templates/accounts/partials/team.html',
                controller: 'Team',
                controllerAs: 'vm'
            })
            .state('account.caregiver', {
                url: '/caregiver',
                templateUrl: '/static/templates/accounts/partials/caregiver.html',
                controller: 'Caregiver',
                controllerAs: 'vm'
            })
            .state('account.security', {
                url: '/security',
                templateUrl: '/static/templates/accounts/partials/security.html',
                controller: 'Security',
                controllerAs: 'vm'
            })
            .state('account.nearme', {
                url: '/nearme',
                templateUrl: '/static/templates/accounts/partials/search.html',
                controller: 'Nearme',
                controllerAs: 'vm'
            })
            .state('account.caregiverProfile', {
                url: '/caregiverProfile/:id',
                templateUrl: '/static/templates/accounts/partials/caregiverProfile.html',
                controller: 'CaregiverProfile',
                controllerAs: 'vm'
            })
            .state('account.careseekerProfile', {
                url: '/careseekerProfile/:id',
                templateUrl: '/static/templates/accounts/partials/careseekerProfile.html',
                controller: 'CareseekerProfile',
                controllerAs: 'vm'
            })
            .state('reset', {
                url: '/reset',
                templateUrl: '/views/accounts/partials/reset.html',
                controller: 'resetCtrl'
            })
            .state('reset_password', {
                url: '/reset_password',
                templateUrl: '/views/accounts/partials/reset_password.html',
                controller: 'resetPasswordCtrl'
            })
            .state('settings', {
                abstract: true,
                templateUrl: '/static/templates/accounts/partials/settings/base_settings.html'
            })
            .state('settings.profile', {
                url: '/settings/profile',
                templateUrl: '/static/templates/accounts/partials/settings/profile.html',
                controller: 'settingsProfileCtrl'
            })
            .state('settings.connections', {
                url: '/settings/connections',
                templateUrl: '/static/templates/accounts/partials/settings/connections.html',
                controller: 'connectionsCtrl'
            })
            .state('settings.seeker', {
                url: '/settings/seeker',
                templateUrl: '/static/templates/accounts/partials/settings/seeker.html',
                controller: 'settingsSeekerCtrl'
            })
            .state('settings.seeker_preview', {
                url: '/settings/seeker_preview',
                templateUrl: '/static/templates/home/partials/previewSeekerProfile.html',
                controller: 'settingsSeekerCtrl'
            })
            .state('provider', {
                abstract: true,
                templateUrl: '/static/templates/accounts/partials/settings/base_settings_provider.html',
            })
            .state('provider.edit', {
                url: '/settings/provider_edit',
                templateUrl: '/static/templates/accounts/partials/settings/provider.html',
                controller: 'providerEditCtrl'
            })
            .state('provider.preview', {
                url: '/settings/preview',
                templateUrl: '/static/templates/home/partials/previewProviderProfile.html',
                controller: 'providerPreviewCtrl'
            })
            .state('provider.media', {
                url: '/settings/media',
                templateUrl: '/static/templates/accounts/partials/settings/media.html',
                controller: 'settingsMediaCtrl'
            })
            .state('provider.verification', {
                url: '/settings/verification',
                templateUrl: '/static/templates/accounts/partials/settings/verification.html',
                controller: 'settingsVerificationCtrl'
            });
    }
})();
/**
 * Admin module.
 */
(function () {
    Config.$inject = ["$stateProvider", "$urlRouterProvider"];
    angular
        .module('Admin', [
            'ui.bootstrap',
            'checklist-model',
            'Common'
        ])
        .config(Config);

    /** ngInject */
    function Config($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('admin', {
                abstract: true,
                templateUrl: '/views/admin/partials/base_admin.html',
                data: {
                    // role: userSessionProvider.roles.AUTHORIZED
                }
            })
            .state('admin.verification', {
                url: '/verification',
                templateUrl: '/views/admin/partials/verification.html',
                controller: 'verificationCtrl'
            })
            .state('admin.password', {
                url: '/password',
                templateUrl: '/views/admin/partials/password.html',
                controller: 'passwordCtrl'
            });
    }

})();
/**
 * A module that has common directives, services, constants, etc.
 */
(function () {
    'use strict';

    angular.module('app.common', []);

})();

'use strict';

/**
 * A module that is common to all other site modules.
 */
(function () {
    Run.$inject = ["$rootScope", "$location", "$state", "userSession"];
    Config.$inject = ["$compileProvider"];
    Ctrl.$inject = ["$scope"];
    angular
        .module('Common', ['ui.router'])
        .run(Run)
        .config(Config)
        .controller('commonCtrl', Ctrl);

    /** @ngInject */
    function Run($rootScope, $location, $state, userSession) {
        // Broadcasted when the state of the module changes.
        $rootScope.$on('$stateChangeStart', stateChangeStartListener);

        // siteAlert is global.
        $rootScope.siteAlert = {};

        function stateChangeStartListener(e, toState, toParams, fromState, fromParams) {
            if (toState.data && angular.isDefined(toState.data.role)) {
                var accessRole = toState.data.role;
                var userRole = userSession.getRole();
                // Guest is redirected account page.
                if (accessRole === userSession.roles.GUEST && userRole !== accessRole) {
                    e.preventDefault();
                    $state.go('settings.profile');
                    return;
                }
                // User is redirected to login.
                if (accessRole === userSession.roles.AUTHORIZED && userRole !== accessRole) {
                    e.preventDefault();
                    $state.go('login',
                        {next: $location.absUrl()},
                        {notify: false}
                    );
                    return;
                }
            }
            // No need to update userSession on page load.
            if (!fromState.abstract) {
                userSession.update();
            }
        }
    }

    /** @ngInject */
    function Config($compileProvider) {
        if (HL.helpers.isProd()) {
            $compileProvider.debugInfoEnabled(false);
        }
    }

    /** @ngInject */
    function Ctrl($scope) {
        // Empty.
    }

})();
/**
 * Core module that bootstrap most of the dependencies and configuration.
 */
(function () {
    'use strict';

    Config.$inject = ["$compileProvider", "$logProvider"];
    angular
        .module('app.core', [
            'ngAnimate',
            'ngMessages',
            'ui.router',
            'ui.bootstrap',
            'app.common',
            'app.router',
            'templates',
        ])
        .config(Config);

    /** ngInject */
    function Config($compileProvider, $logProvider) {
        if (hl.isProd()) {
            $compileProvider.debugInfoEnabled(false);
            $logProvider.debugEnabled(false);
        }
    }

    (function () {
        'use strict';

        angular
            .module('templates', [])
    })();

})();
/**
 * UI Router wrapper and helpers.
 */
(function () {
    'use strict';

    Run.$inject = ["$log", "$rootScope", "$window", "$state"];
    angular
        .module('app.router', [])
        .run(Run);

    /** ngInject */
    function Run($log, $rootScope, $window, $state) {
        onStateChange();

        /**
         * Sets the page title on a state transition.
         * The page is customized to Humanlink.
         *
         * Usage:
         *   Include a `title` property in the state's resolve object.
         *
         *   $stateProvider.state('parent', {
         *       resolve: {title: function () { return 'constant'; }}
         *   })
         *   $stateProvider.state('parent.child', {
         *       resolve: {title: function (SomeService) {
         *          return SomeService.stuff();
         *      }}
         *   })
         */
        function onStateChange() {
            $log.debug('app.router: onStateChange');
            $rootScope.$on('$stateChangeSuccess', function () {
                var title = 'Humanlink';
                var resTitle = $state.$current.locals.globals.title;
                if (angular.isString(resTitle)) {
                    title = resTitle + ' | Humanlink';
                }
                $window.document.title = title;
            });
        }
    }

})();
/**
 * Dashboard module.
 */
(function () {
    'use strict';

    Config.$inject = ["$locationProvider", "$stateProvider", "$urlRouterProvider", "$httpProvider"];
    Run.$inject = ["$rootScope", "$log", "$state", "MessageFormatter"];
    rootResolve.$inject = ["DashboardHelper"];
    angular
        .module('app.dashboard', [
            'app.core',
            'app.repo',
            'app.dashboard.team',
            'app.dashboard.thread'
        ])
        .config(Config)
        .run(Run);

    /** ngInject */
    function Config($locationProvider, $stateProvider, $urlRouterProvider, $httpProvider) {

        $locationProvider.html5Mode(true);
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('dashboard', {
                abstract: true,
                url: '/',
                views: {
                    'sidebar': {
                        templateUrl: '/static/templates/dashboard/partials/sidebar.html',
                        controller: 'Sidebar',
                        controllerAs: 'sidebar'
                    },
                    '': {
                        template: '<div ui-view></div>',
                        controller: 'Base',
                        controllerAs: 'base'
                    }
                },
                resolve: {
                    ready: rootResolve
                }
            })
            .state('dashboard.default', {
                url: '',
                templateUrl: '/static/templates/dashboard/partials/welcome.html',
                controller: 'Welcome',
                controllerAs: 'vm',
                resolve: { title: function () { return 'Dashboard';} }
            })
            .state('dashboard.new_thread', {
                url: 'new',
                templateUrl: '/static/templates/dashboard/partials/create.html',
                controller: 'CreateThread',
                controllerAs: 'vm',
                resolve: { title: function () { return 'Create Channel';} }
            })
            .state('state-error', {
                templateUrl: '/static/templates/dashboard/partials/state-error.html',
                params: {error: null},
                controller: /** ngInject */ ["$stateParams", function ($stateParams) {
                    var vm = this;
                    vm.error = $stateParams.error;
                    vm.showError = false;
                }],
                controllerAs: 'vm',
                resolve: { title: function () { return 'Error!!!';} }
            })
    }

    /** ngInject */
    function Run($rootScope, $log, $state, MessageFormatter) {
        $rootScope.$on('$stateChangeError',
            function (event, toState, toParams, fromState, fromParams, error) {
                event.preventDefault();
                $log.error(error);
                $state.go('state-error', {error: error});
            });

        // Register formatters that are used for rendering message body.
        MessageFormatter.formatters.push(hl.markdown);
    }

    /** ngInject */
    function rootResolve(DashboardHelper) {
        return DashboardHelper.initialize();
    }


})();
/**
 * Guest module.
 */
(function () {
    'use strict';

    Config.$inject = ["$locationProvider", "$stateProvider", "$urlRouterProvider", "$httpProvider"];
    angular
        .module('app.guest', [
            'app.common',
            'app.core',
            'app.repo',
            'ui.bootstrap',
            'ngCookies',
        ])
        .config(Config)
        .run(['$http', '$cookies', function ($http, $cookies) {
            // set the CSRF token here
            $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
        }])

    /** ngInject */
    function Config($locationProvider, $stateProvider, $urlRouterProvider, $httpProvider) {

        broadcastReady.$inject = ["CommonService", "CommonEvents"];
        $locationProvider.html5Mode(true);
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('auth', {
                abstract: true,
                templateUrl: '/static/templates/home/partials/auth/main.html',
                controller: 'Auth',
                controllerAs: 'auth'
            })
            .state('auth.login', {
                url: '/login?next',
                templateUrl: '/static/templates/home/partials/auth/login.html',
                controller: 'Login',
                controllerAs: 'vm'
            })
            .state('auth.search', {
                url: '/search',
                templateUrl: '/static/templates/home/partials/search.html',
                controller: 'searchCtrl'
            })
            .state('auth.reset', {
                url: '/reset',
                templateUrl: '/static/templates/home/partials/auth/reset.html',
                controller: 'Reset',
                controllerAs: 'vm'
            })
            .state('auth.verify', {
                url: '/verify',
                templateUrl: '/static/templates/home/partials/auth/verify.html',
                controller: 'Verify',
                controllerAs: 'vm'
            })
            .state('auth.join', {
                abstract: true,
                templateUrl: '/static/templates/home/partials/auth/join.html',
                controller: 'Join',
                controllerAs: 'vm'
            })
            .state('auth.faq', {
                url: '/faq',
                templateUrl: '/static/templates/home/partials/faq.html',
                controller: 'faqCtrl'
            })
            .state('auth.previewProviderProfile', {
                url: '/previewProviderProfile/:account_id',
                templateUrl: '/static/templates/home/partials/previewProviderProfile.html',
                controller: 'previewProviderProfileCtrl'
            })
            .state('auth.previewSeekerProfile', {
                url: '/previewSeekerProfile/:account_id',
                templateUrl: '/static/templates/home/partials/previewSeekerProfile.html',
                controller: 'previewSeekerProfileCtrl'
            })
            .state('auth.join.personal', {
                url: '/join?invite',
                templateUrl: '/static/templates/home/partials/auth/join.personal.html',
                controller: broadcastReady
            })
            .state('auth.join.team', {
                templateUrl: '/static/templates/home/partials/auth/join.team.html',
                controller: broadcastReady
            })
            .state('auth.accept', {
                url: '/accept/{token}/?data',
                views: {
                    '': {
                        templateUrl: '/static/templates/home/partials/auth/accept.html',
                        controller: 'Accept',
                        controllerAs: 'vm',
                        reloadOnSearch: false
                    },
                    'signup@auth.accept': {
                        templateUrl: '/static/templates/home/partials/auth/accept.signup.html'
                    },
                    'login@auth.accept': {
                        templateUrl: '/static/templates/home/partials/auth/accept.login.html'
                    }
                }
            })
            .state('auth.threadAccept', {
                    url: '/thread/{token}/?data',
                    views: {
                        '': {
                            templateUrl: '/static/templates/home/partials/thread/thread.accept.html',
                            controller: 'ThreadAccept',
                            controllerAs: 'vm',
                            reloadOnSearch: false
                        },
                        'signup@auth.threadAccept': {
                            templateUrl: '/static/templates/home/partials/thread/thread.accept.signup.html'
                        },
                        'login@auth.threadAccept': {
                            templateUrl: '/static/templates/home/partials/thread/thread.accept.login.html'
                        },
                    }
                });

        /** ngInject */
        function broadcastReady(CommonService, CommonEvents) {
            CommonService.broadcast(CommonEvents.viewReady);
        }
    }

})();
Config.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider",
		 		  "$urlMatcherFactoryProvider", "$httpProvider"];
var home = angular.module('Home', ['ui.router']).config(Config)

function Config($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/static/templates/home/partials/landing.html',
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
/**
 * Nearme module.
 */

(function () {
    'use strict';

    Config.$inject = ["$locationProvider", "$stateProvider", "$urlRouterProvider"];
    angular
        .module('app.nearme', [
            'app.core',
            'app.repo'
        ])
        .config(Config);

    /** ngInject */
    function Config($locationProvider, $stateProvider, $urlRouterProvider) {

        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('nearme', {
                abstract: true,
                views: {
                    '': {
                        templateUrl: '/static/templates/nearme/partials/main.html',
                        controller: 'Base',
                        controllerAs: 'base'
                    },
                    'loader@nearme': {
                        templateUrl: '/static/templates/nearme/partials/loader.html'
                    }
                }
            })
            .state('nearme.search', {
                url: '/',
                templateUrl: '/static/templates/nearme/partials/search.html',
                controller: 'Nearme',
                controllerAs: 'vm'
            });
    }

})();

/**
 * Repository module that communicates with the backend APIs.
 */
(function () {
    'use strict';

    angular.module('app.repo', []);

})();
/**
 * Settings module.
 */
(function () {
    'use strict';

    Config.$inject = ["$locationProvider", "$stateProvider", "$urlRouterProvider"];
    angular
        .module('app.settings', [
            'app.core',
            'app.repo'
        ])
        .config(Config);

    /** ngInject */
    function Config($locationProvider, $stateProvider, $urlRouterProvider) {

        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/payments');

        $stateProvider
            .state('settings', {
                abstract: true,
                views: {
                    '': {
                        templateUrl: '/static/templates/settings/partials/main.html',
                        controller: 'Base',
                        controllerAs: 'base'
                    },
                    'loader@settings': {
                        templateUrl: '/static/templates/settings/partials/loader.html'
                    }
                }
            })
            .state('settings.notifications', {
                url: '/notifications',
                templateUrl: '/static/templates/settings/partials/notifications.html',
                controller: 'Notifications',
                controllerAs: 'vm'
            })
            .state('settings.payments', {
                url: '/payments',
                templateUrl: '/static/templates/settings/partials/payments.html',
                controller: 'Payments',
                controllerAs: 'vm'
            })
            .state('settings.transactions', {
                url: '/transactions',
                template: 'transactions'
            })
            .state('settings.security', {
                url: '/security',
                templateUrl: '/static/templates/accounts/partials/security.html',
                controller: 'Security',
                controllerAs: 'vm'
            })
            .state('settings.close', {
                url: '/close',
                template: 'close account'
            });
    }

})();

// 'use strict';
//
// /**
//  * Settings module.
//  */
// (function () {
//     Config.$inject = ["$stateProvider", "$urlRouterProvider"];
//     angular
//         .module('Settings', [
//             'ui.bootstrap',
//             'checklist-model',
//             'Common',
//             'stripe'
//         ])
//         .config(Config);
//
//     /** ngInject */
//     function Config($stateProvider, $urlRouterProvider) {
//
//         $urlRouterProvider.otherwise('/');
//
//         $stateProvider
//             .state('settings', {
//                 abstract: true,
//                 templateUrl: '/views/settings/partials/base_settings.html',
//             })
//             .state('settings.security', {
//                 url: '/',
//                 templateUrl: '/views/settings/partials/security.html',
//                 controller: 'securityCtrl'
//             })
//             .state('settings.payments', {
//                 url: '/payments',
//                 templateUrl: '/views/settings/partials/payments.html',
//                 controller: 'paymentsCtrl'
//             })
//             .state('settings.notifications', {
//                 url: '/notifications',
//                 templateUrl: '/views/settings/partials/notifications.html',
//                 controller: 'notificationsCtrl'
//             });
//     }
//
// })();
/**
 * Team management and settings module.
 */
(function () {
    'use strict';

    Config.$inject = ["$stateProvider"];
    orgInfoResolve.$inject = ["ready", "$stateParams", "$q", "OrgService"];
    angular
        .module('app.dashboard.team', [])
        .config(Config);

    /** ngInject */
    function Config($stateProvider) {

        $stateProvider
            .state('dashboard.team', {
                abstract: true,
                url: 'manage/{org}',
                templateUrl: '/static/templates/dashboard/partials/team/main.html',
                controller: 'Team',
                controllerAs: 'vm',
                resolve: {
                    orgInfo: orgInfoResolve
                }
            })
            .state('dashboard.team.directory', {
                url: '',
                templateUrl: '/static/templates/dashboard/partials/team/directory.html',
                controller: 'Directory',
                controllerAs: 'vm'
            })
            .state('dashboard.team.invite', {
                url: '/invite',
                templateUrl: '/static/templates/dashboard/partials/team/invite.html',
                controller: 'OrgInvite',
                controllerAs: 'vm'
            });
    }

    /**
     * Org info resolved dependency that can be injected into the controllers.
     * @param ready: (required) wait for the dashboard `ready` to resolve.
     * @return {Promise}
     */
    /** ngInject */
    function orgInfoResolve(ready, $stateParams, $q, OrgService) {
        if (!$stateParams.org) {
            return $q.reject('Invalid team.');
        }
        return OrgService.getOrgByUsername($stateParams.org);
    }

})();
/**
 * Thread module.
 */
(function () {
    'use strict';

    Config.$inject = ["$stateProvider"];
    threadInfoResolve.$inject = ["ready", "$stateParams", "$q", "underscore", "MessagesService"];
    angular
        .module('app.dashboard.thread', [
            'ngSanitize',
            'luegg.directives'
        ])
        .config(Config);

    /** ngInject */
    function Config($stateProvider) {

        $stateProvider
            .state('dashboard.messages', {
                url: 'c/{owner}/{thread}',
                params: {threadId: null},
                resolve: {
                    threadInfo: threadInfoResolve,
                    title: ["threadInfo", function (threadInfo) {
                        return threadInfo.thread.name;
                    }]
                },
                views: {
                    '': {
                        templateUrl: '/static/templates/dashboard/partials/thread/main.html',
                        controller: 'Thread',
                        controllerAs: 'thread'
                    },
                    'header@dashboard.messages': {
                        templateUrl: '/static/templates/dashboard/partials/thread/header.html',
                        controller: ["threadInfo", function (threadInfo) {
                            this.thread = threadInfo.thread;
                        }],
                        controllerAs: 'vm'
                    },

                }
            })
            .state('dashboard.messages.default', {
                url: '/',
                templateUrl: '/static/templates/dashboard/partials/thread/messages.html',
                controller: 'Messages',
                controllerAs: 'vm',
                resolve: {
                    threadInfo: threadInfoResolve,
                }
            })
            .state('dashboard.messages.invite', {
                url: '/invite',
                templateUrl: '/static/templates/dashboard/partials/thread/invite.html',
                controller: 'Invite',
                controllerAs: 'vm',
                resolve: {
                    threadInfo: threadInfoResolve,
                }
            })
            .state('dashboard.messages.update', {
                url: '/update',
                templateUrl: '/static/templates/dashboard/partials/thread/update.html',
                controller: 'Update',
                controllerAs: 'vm',
                resolve: {
                    threadInfo: threadInfoResolve,
                }
            })
            .state('dashboard.messages.pending', {
                url: '/pending',
                templateUrl: '/static/templates/dashboard/partials/thread/pending.html',
                controller: 'Pending',
                controllerAs: 'vm'
            })
            .state('dashboard.messages.leave', {
                url: '/leave',
                templateUrl: '/static/templates/dashboard/partials/thread/leave.html',
                controller: 'Leave',
                controllerAs: 'vm'
            })
            .state('dashboard.messages.archive', {
                url: '/archive',
                templateUrl: '/static/templates/dashboard/partials/thread/archive.html',
                controller: 'Archive',
                controllerAs: 'vm'
            })
            .state('dashboard.messages.search', {
                url: '/search',
                templateUrl: '/static/templates/dashboard/partials/thread/search.html',
                controller: 'Search',
                controllerAs: 'vm'
            })
            .state('dashboard.messages.default.sidepanel', {
                abstract: true,
                templateUrl: '/static/templates/dashboard/partials/thread/sidepanel.html',
                controller: 'Sidepanel',
                controllerAs: 'sp'
            })
            .state('dashboard.messages.default.sidepanel.default', {
                url: 'info',
                templateUrl: '/static/templates/dashboard/partials/thread/info.html',
                controller: 'Info',
                controllerAs: 'vm'
            })
    }

    /**
     * Thread info resolved dependency that can be injected into the controllers.
     * @param ready: (required) wait for the dashboard `ready` to resolve.
     * @return {Promise}
     */
    /** ngInject */
    function threadInfoResolve(ready, $stateParams, $q, underscore, MessagesService) {
        if ($stateParams.threadId) {
            var thread = MessagesService.getThreadInfo($stateParams.threadId);
            return populate(thread);
        }

        return MessagesService.getThreads().then(function (threads) {
            var ownerId = parseInt($stateParams.owner);
            var threadName = $stateParams.thread.toLowerCase();

            //venkatesh
            function thread(threads) {
                var threadsList = threads[0];
                for (var thread in threadsList) {
                    if (threadsList[thread].owner.id === ownerId && threadsList[thread].name.toLowerCase() === threadName) {
                        return threadsList[thread]
                    }
                }
            }
            var threadResult = thread(threads);

            return populate(threadResult);
        });

        function populate(thread) {
            if (!thread || !thread.membersIndexed || !thread.owner) {
                return $q.reject('Channel not found.');
            }
            $stateParams.threadId = thread.id;
            return {
                thread: thread,
                members: thread.membersIndexed,
                owner: thread.owner
            };
        }
    }

})();
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

                var height = w.height() - (headerHeight + textareaHeight);
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
        .run(["$rootScope", function ($rootScope) {
            $rootScope.model = {id: 2};
        }])
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
(function () {
    'use strict';

    CommonService.$inject = ["$q", "$log", "$rootScope", "$window"];
    angular
        .module('app.common')
        .factory('CommonService', CommonService);

    /** ngInject */
    function CommonService($q, $log, $rootScope, $window) {

        return {
            broadcast: broadcast,
            on: on,
            previous: previous,
            hardRedirect: hardRedirect
        };

        /**
         * Broadcasts an event at the `$rootScope` level.
         * Alias to `$rootScope.$broadcast`.
         */
        function broadcast() {
            return $rootScope.$broadcast.apply($rootScope, arguments);
        }

        /**
         * Listens to a given event at the `$rootScope` level.
         * Alias to `$rootScope.$on`.
         */
        function on() {
            return $rootScope.$on.apply($rootScope, arguments);
        }

        /**
         * Go back to the previous page or view.
         */
        function previous() {
            $window.history.back();
        }

        /**
         * Performs a hard redirect (full page refresh) to a URL.
         * @param url
         */
        function hardRedirect(url) {
            $window.location.href = '/r?url=' + decodeURIComponent(url);
        }

    }

})();
/**
 * Underscore.js wrapper as a factory.
 * Docs: http://underscorejs.org/
 */
(function () {
    'use strict';

    Underscore.$inject = ["$window"];
    angular
        .module('app.common')
        .factory('underscore', Underscore);

    /** ngInject */
    function Underscore($window) {

        return $window._;

    }

})();
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
'use strict';

window.HL = window.HL || {};

/**
 * Constants and enums that are shared between the server and the client.
 * These should eventually be auto-generated.
 */
(function (obj) {
    var accountTypes = [
        {"value": 0, "name": "Caregiver"},
        {"value": 1, "name": "Careseeker"},
        {"value": 2, "name": "Business or Organization"}
    ];
    var certificates = [
        {"value": 0, "name": "CNA", "description": "Certified Nursing Aide"},
        {"value": 1, "name": "HHA", "description": "Home Health Aide"},
        {"value": 2, "name": "PCA", "description": "Personal Care Aide"},
    ];
    var states = [
        {"value": 0, "name": "AL", "description": "Alabama"},
        {"value": 1, "name": "AK", "description": "Alaska"},
        {"value": 2, "name": "AR", "description": "Arkansas"},
        {"value": 3, "name": "AZ", "description": "Arizona"},
    ];
    var languages = [
        {"value": 0, "name": "English"},
        {"value": 1, "name": "Arabic"},
        {"value": 2, "name": "French"},
        {"value": 3, "name": "Gujarati"},
    ];
    var careServices = [
        {
            "value": 0,
            "name": "Companion",
            "description": "Companionship",
            "skills": "All things required by companions"
        },
        {
            "value": 1,
            "name": "Grooming",
            "description": "Personal Grooming",
            "skills": "Bathing, dressing and dealing with incontinence"
        },
        {
            "value": 2,
            "name": "Meals",
            "description": "Meal Preparations",
            "skills": "Hot/cold meal preparations"
        },
        {
            "value": 3,
            "name": "Housekeeping",
            "description": "Housekeeping",
            "skills": "Housekeeping - Laundry and cleaning"
        },
        {
            "value": 4,
            "name": "Medication",
            "description": "Medication reminders",
            "skills": "Medication reminders"
        },
        {
            "value": 5,
            "name": "Transportation",
            "description": "Transportation",
            "skills": "Transportation from home to clinic and back"
        },
        {
            "value": 6,
            "name": "Alzheimers",
            "description": "Alzheimer's and Dementia",
            "skills": "Companionship, Mental simulation, 24-hour care"
        },
        {
            "value": 7,
            "name": "Mobility",
            "description": "Mobility assistance",
            "skills": "Mobility assistance"
        }
    ];
    var vaccines = [
        {"value": 0, "name": "Flu", "description": "Flu Vaccine"},
        {"value": 1, "name": "TB", "description": "TB Test"},
        {"value": 2, "name": "Drug", "description": "Drug Test"}
    ];
    var allergies = [
        {"value": 0, "name": "Cats"},
        {"value": 1, "name": "Dogs"},
        {"value": 2, "name": "Smoking"}
    ];
    var transportation = [
        {
            "value": 0,
            "name": "CanProvide",
            "description": "I can provide a transportation for the client"
        },
        {
            "value": 1,
            "name": "CanDrive",
            "description": "I can drive the client's car"
        },
        {
            "value": 2,
            "name": "NotDrive",
            "description": "I prefer not to drive the care recipient"
        }
    ];
    var expertise = [
        {
            "value": 0,
            "name": "ALS",
            "description": "ALS"
        },
        {
            "value": 1,
            "name": "AlzheimersDisease",
            "description": "Alzheimer's Disease"
        },
        {
            "value": 2,
            "name": "BloodDisorders",
            "description": "Blood Disorders"
        },
        {
            "value": 3,
            "name": "Cancer",
            "description": "Cancer"
        }
    ];
    obj.constants = {
        accountTypes: accountTypes,
        states: states,
        languages: languages,
        careServices: careServices,
        allergies: allergies,
        vaccines: vaccines,
        transportation: transportation,
        certificates: certificates,
        expertise: expertise
    };
}(window.HL));/**
 * Created by timothybaney on 5/16/16.
 */

(function () {
    'use strict';

    angular
        .module('app.common')
        .constant('CommonEvents', getEvents());

    /**
     * Common event names.
     * @returns {{viewLoading: string, viewReady: string}}
     */
    function getEvents() {
        return {
            viewLoading: 'viewLoading',
            viewReady: 'viewReady'
        };
    }

})();
/**
 * pusher-js wrapper as a factory.
 * Docs: https://github.com/pusher/pusher-js
 */
(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('$pusher', $pusher);

    /** ngInject */
    function $pusher() {
        var self = this;
        self.client = new Pusher('2676265f725e22f7e5d0', {
          cluster: 'mt1',
          encrypted: true
        });

        return {
            client: self.client
        };
    }

})();
/**
 * Created by timothybaney on 6/15/16.
 */

(function () {
    'use strict';

    angular
        .module('app.core')
        .constant('Config', getConfig());

    function getConfig() {

        return {
            api_path: '',

            pusher: {
                // TODO: add environment-based configs values.
                key: 'feea095554f736862bf4',
                options: {
                    encrypted: true
                    // auth: {
                    //     headers: {
                    //         'X-CSRFToken': 'ih3Kz95cZcjs69BMTHI14cNQO4naGTgR',
                    //     //    Token needs to be dynamic
                    //     }
                    // }
                }
            }
        };
    }

})();
/**
 * Dashboard helper/bootstraper.
 */
(function () {
    'use strict';

    DashboardHelper.$inject = ["$q", "$log", "$timeout", "$pusher", "PushListener", "MessagesService", "Session"];
    angular
        .module('app.dashboard')
        .factory('DashboardHelper', DashboardHelper);

    /** ngInject */
    function DashboardHelper($q, $log, $timeout, $pusher, PushListener,
                             MessagesService, Session) {

        return {
            initialize: init
        };

        /**
         * Bootstraps the Dashboard module, specifically:
         *   - Fetches org summary
         *   - Fetches thread messages
         *   - Binds pusher events.
         */
        function init() {
            var threadsPr = MessagesService.getThreads().then(function (threads) {
                // Asynchronously fetch thread histories.
                // TODO: Delay won't be necessary once all templates are in one place.
                $timeout(function () {fetchThreads(threads)}, 100);
                return threads;
            });
            var pusherPr = bindPusher();
            return $q.all([threadsPr, pusherPr]);
        //    remember to put pusherPr back into array on line above next to threadsPr
        }

        /**
         * Fetches history for all the threads in the org.
         *
         * TODO: only fetch recent 3-5 threads.
         */
        function fetchThreads(threads) {
            threads[0].forEach(function (thread) {
                if (thread.is_archived) {
                    return;
                }
                MessagesService.getHistory(thread.id);
            });
        }

        /**
         * Subscribes to user's Pusher channel and binds callback events.
         */
        function bindPusher() {
            var defer = $q.defer();
            var channelName = 'public-account-' + Session.account.id;
            var channel = $pusher.client.subscribe(channelName);

            /** - Used for testing Pusher.com - delete when Pusher testing is not required
            channel.bind('my_event', function(data) {
                alert('There\'s a new chat !');
            });
             */

            channel.bind('pusher:subscription_succeeded', function (data) {
                $log.debug('Pusher subscribed: ' + channel.name);
                PushListener.bindAndListen(channel);
                defer.resolve(data);
            });
            channel.bind('pusher:subscription_error', function (status) {
                if (status === 403) {
                    var msg = 'Pusher channel not authorized.';
                    $log.warn(msg);
                    defer.reject(msg);
                }
            });

            return defer.promise;
        }
    }

})();
(function () {
    'use strict';

    AbstractRepo.$inject = ["$log", "$http", "$q", "Config"];
    angular
        .module('app.repo')
        .factory('AbstractRepo', AbstractRepo);

    /** ngInject */
    function AbstractRepo($log, $http, $q, Config) {

        return {
            get: get,
            post: post,
            put: put,
            genericSuccess: genericSuccess,
            genericError: genericError
        };

        function get(uri, data, isApi) {
            return httpRequest('GET', uri, data, isApi);
        }

        function post(uri, data, isApi) {
            return httpRequest('POST', uri, data, isApi);
        }

        function put(uri, data, isApi) {
            return httpRequest('PUT', uri, data, isApi);
        }

        function httpRequest(method, uri, data, isApi) {
            isApi = angular.isDefined(isApi) ? isApi : true;

            var deferred = $q.defer();
            var promise = $http({
                method: method,
                url: (isApi ? Config.api_path : '/') + uri,
                data: data || {},
                timeout: deferred.promise
            }).catch(function (response) {
                $log.error(response);
                return $q.reject(response);
            }).finally(function () {
                promise.abort = angular.noop;
                deferred = null;
                promise = null;
            });
            // Abort the underlying request.
            promise.abort = function () {
                deferred.resolve();
            };
            return promise;
        }

        function genericSuccess(response) {
            return response.data;
        }

        function genericError(response) {
            var reason = "Oops, something went wrong. That's our bad.";
            if (response.status < 500 && response.data.response) {
                reason = response.data.response;
            }
            return $q.reject(reason);
        }

    }

})();
(function () {
    'use strict';

    AccountRepo.$inject = ["$q", "$log", "AbstractRepo"];
    angular
        .module('app.repo')
        .factory('AccountRepo', AccountRepo);

    /** ngInject */
    function AccountRepo($q, $log, AbstractRepo) {

        return {
            accept: accept,
            invite: invite,
            join: join,
            login: login,
            save: save,
            getTeam: getTeam,
            updateTeam: updateTeam,
            getCaregiver: getCaregiver,
            updateCaregiver: updateCaregiver,
            me: me,
            threadInvite: threadInvite,
            search: search,
            caregiver_info: caregiver_info,
            careseeker_info: careseeker_info,
            connect: connect,
            get_caregivers: get_caregivers,
            get_seekers: get_seekers,
            check_availability: check_availability,
            resetPassword: resetPassword,
            verifyEmail: verifyEmail,
            resetPasswordEmail: resetPasswordEmail,
        };

        /**
         * Create a new account with a new team.
         * @param model:
         * @returns {*}
         */
        function join(model) {
            return AbstractRepo.post('accounts/signup/', model, false)
                .then(genericSuccess, genericError);
        }

        /**
         * Authenticate an account.
         * @param model:
         * @returns {*}
         */
        function login(model) {
            return AbstractRepo.post('accounts/login/', model, false)
                .then(genericSuccess, genericError);
        }

        /**
         * Accept a org member invitation.
         * @param model: token, email, password, password_raw
         * @returns {Promise}
         */
        function accept(model) {
            return AbstractRepo.post('accounts/accept/', model, false)
                .then(genericSuccess, genericError);
        }

        /**
         * Send a connect invitation to people around you.
         * @param model: email of sender/receiver
         * @returns {Promise}
         */
        function connect(model) {
            return AbstractRepo.post('accounts/connect/?email=' + model, model, false)
                .then(genericSuccess, genericError);
        }

        /**
         * Update account information.
         * @param model
         * @returns {Promise}
         */
        function save(model) {
            return AbstractRepo.post('accounts/update/', model, false)
                .then(apiGenericSuccess, genericError);
        }

        /**
         * Get Team information.
         * @returns {*}
         */
        function getTeam() {
            return AbstractRepo.get('/accounts/getTeam/');
        }

        /**
         * Update Team information.
         * @param model
         * @returns {Promise}
         */
        function updateTeam(model) {
            return AbstractRepo.post('accounts/updateTeam/', model, false)
                .then(apiGenericSuccess, genericError);
        }

        /**
         * Get Caregiver information.
         * @returns {*}
         */
        function getCaregiver() {
            return AbstractRepo.get('/accounts/get_caregiver/');
        }

        /**
         * Update Caregiver information.
         * @param model
         * @returns {Promise}
         */
        function updateCaregiver(model) {
            return AbstractRepo.post('accounts/update_caregiver/', model, false)
                .then(apiGenericSuccess, genericError);
        }

        /**
         * Retrieve account information about the current user.
         * @returns {*}
         */
        function me() {
            return AbstractRepo.get('/accounts/me/');
        }

        /**
         * Get Search results.
         * @returns {*}
         */
        function search() {
            return AbstractRepo.get('/accounts/nearme');
        }

        /**
         * Get caregiver info .
         * @returns {*}
         */
        function caregiver_info(model) {
            return AbstractRepo.get('/accounts/caregiverProfile/?email=' + model.email);
        }

        /**
         * Get careseeker info .
         * @returns {*}
         */
        function careseeker_info(model) {
            return AbstractRepo.get('/accounts/careseekerProfile/?email=' + model.email);
        }

        /**
         * Retrieve caregiver information for all caregivers, or those that match search parameters
         * @returns {*}
         */
        function get_caregivers() {
            return AbstractRepo.get('/accounts/search_caregivers/');
        }

        /**
         * verify email.
         * @param model
         * @returns {Promise}
         */
        function verifyEmail(model) {
            return AbstractRepo.post('accounts/verify_email/', model, false)
                .then(apiGenericSuccess, genericError);
        }

        /**
         * reset password information.
         * @param model
         * @returns {Promise}
         */
        function resetPassword(model) {
            return AbstractRepo.post('accounts/reset_password/', model, false)
                .then(apiGenericSuccess, genericError);
        }

        /**
         * reset password request using email
         * @param model
         * @returns {Promise}
         */
        function resetPasswordEmail(model) {
            return AbstractRepo.post('accounts/reset_password_email/', model, false)
                .then(apiGenericSuccess, genericError);
        }

        /**
         * Retrieve all seekers.
         * @returns {*}
         */
        function get_seekers() {
            return AbstractRepo.get('/accounts/search_seekers/');
        }

        /**
         * Retrieve all seekers.
         * @returns {*}
         */
        function check_availability(account_id) {
            return AbstractRepo.get('accounts/availability/' + account_id);
        }

        /**
         * Retrieve an org member invitation by token.
         * @param token
         * @returns {Promise}
         */
        function invite(token) {
            return AbstractRepo.get('accounts/invite/' + token, {}, false)
                .then(genericSuccess, function (response) {
                    if (response.status === 400) {
                        return $q.reject({'used': true});
                    }
                    if (response.status === 404) {
                        return $q.reject(null);
                    }
                    return genericError(response);
                });
        }

        function threadInvite(token) {
            return AbstractRepo.get('messages/invite/' + token, {}, false)
                .then(genericSuccess, function (response) {
                    if (response.status === 400) {
                        return $q.reject({'used': true});
                    }
                    if (response.status === 400) {
                        return $q.reject(null);
                    }
                    return genericError(response);
                })
        }

        function genericSuccess(response) {
            return response.data;
        }

        function genericError(response) {
            var reason = "Oops, something went wrong. That's our bad.";
            if (response.status < 500 && response.data.response.message) {
                reason = response.data.response.message;
            }
            return $q.reject(reason);
        }

        function apiGenericSuccess(response) {
            return response.data.data;
        }

    }

})();
(function () {
    'use strict';

    MessagesRepo.$inject = ["$q", "$log", "AbstractRepo"];
    angular
        .module('app.repo')
        .factory('MessagesRepo', MessagesRepo);

    /** ngInject */
    function MessagesRepo($q, $log, AbstractRepo) {

        return {
            fetchThreads: fetchThreads,
            fetchHistory: fetchHistory,
            send: send,
            create: create,
            invite: invite,
            removeMember: removeMember,
            update: update,
            leave: leave,
            archive: archive,
            search: search
        };


        function fetchThreads() {
            return AbstractRepo.get('/message/').then(
                apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Retrieve thread history.
         *
         * @param threadId:
         * @param model: {ts}
         */
        function fetchHistory(threadId, model) {
            return AbstractRepo.post('/message/' + threadId + '/history/', model)
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Send message to a thread.
         *
         * @param threadId:
         * @param model: {message}.
         */
        function send(threadId, model) {
            return AbstractRepo.post('/message/' + threadId + '/send/', model)
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Create a new thread.
         *
         * @param model: {org_id, thread name, purpose}
         */
        function create(model) {
            return AbstractRepo.post('/message/create/', model)
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Remove Member from thread.
         *
         * @param model: {account_id}
         */
        function removeMember(threadId, model) {
            return AbstractRepo.post('/message/' + threadId.thread_id + '/' + threadId.member_id + '/remove/', model)
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Send Invite to a new person
         *
         * @param threadID:
         * @param model: name and email of the person receiving the invite.
         */
        function invite(threadId, model) {
            return AbstractRepo.post('/message/' + threadId + '/member/', model)
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Update thread purpose.
         *
         * @param threadId:
         * @param model: {thread name, purpose}
         */
        function update(threadId, model) {
            return AbstractRepo.put('/message/' + threadId + '/update/', model)
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Leave channel
         *
         * @param threadID:
         */
        function leave(threadId) {
            return AbstractRepo.post('/message/' + threadId + '/leave/')
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Archive the channel
         *
         * @param threadID:
         */
        function archive(threadId) {
            return AbstractRepo.post('/message/' + threadId + '/archive/')
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Search caregivers
         *
         * @param threadID:
         */
        function search(threadId) {
            return AbstractRepo.post('/message/' + threadId + '/search/')
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        function apiGenericSuccess(response) {
            return response.data.response;
        }

    }

})();
(function () {
    'use strict';

    OrgsRepo.$inject = ["AbstractRepo"];
    angular
        .module('app.repo')
        .factory('OrgsRepo', OrgsRepo);

    /** ngInject */
    function OrgsRepo(AbstractRepo ) {

        return {
            fetchSummary: fetchSummary,
            sendInvite: sendInvite
        };

        /**
         * Retrieve org summary for the current account.
         */
        function fetchSummary() {
            return AbstractRepo.get('/orgs').then(
                function (response) {
                    return response.data.response;
                },
                AbstractRepo.genericError
            );
        }

        /**
         * Send Invite to a new person
         *
         * @param orgID:
         * @param model: name and email of the person receiving the invite.
         */
        function sendInvite(orgId, model) {
            return AbstractRepo.post('/orgs/' + orgId + '/invite-email/', model)
                .then(AbstractRepo.genericSuccess, AbstractRepo.genericError);
        }

    }

})();
(function () {
    'use strict';

    SettingsRepo.$inject = ["$q", "$log", "AbstractRepo"];
    angular
        .module('app.repo')
        .factory('SettingsRepo', SettingsRepo);

    /** ngInject */
    function SettingsRepo($q, $log, AbstractRepo) {

        var cache = {
            settings: null
        };

        return {
            addPayment: addPayment,
            changePassword: changePassword,
            closeAccount: closeAccount,
            deletePayment: deletePayment,
            getSettings: getSettings,
            updateNotifications: updateNotifications
        };

        function getSettings(forceRemote) {
            if (!cache.settings || forceRemote) {
                cache.settings = dummyData();
            }
            return $q.when(cache.settings);
        }

        function changePassword(model) {
            console.log(model);
            return AbstractRepo.post('accounts/signup/', model, false)
                .then(genericSuccess, genericError);
        }

        function updateNotifications(model) {
            $log.debug('Fake change notifications.');
            return $q.when({'message': 'ok'});
        }

        function addPayment(paymentMethod) {
            cache.settings.payment = paymentMethod;
            return $q.when(cache.settings);
        }

        function deletePayment() {
            cache.settings.payment = "";
            return $q.when(cache.settings);
        }

        function closeAccount(model) {
            $log.debug('Fake close account.');
            return $q.when({'message': 'ok'});
        }

        function dummyData() {
            var settings = {
                notifications: {
                    "logins_sms": false,
                    "messages_sms": true,
                    "company_updates_email": true,
                    "request_reminders_email": false,
                    "company_promotions_email": true
                },
                payment: {
                    "brand": "Visa",
                    "last4": "4242",
                    "exp_month": "06",
                    "exp_year": "15",
                    "address_zip": "72701"
                }
            };
            return settings;
        }

        function genericSuccess(response) {
            return response.data;
        }

        function genericError(response) {
            var reason = "Oops, something went wrong. That's our bad.";
            if (response.status < 500 && response.data.response.message) {
                reason = response.data.response.message;
            }
            return $q.reject(reason);
        }

        function apiGenericSuccess(response) {
            return response.data.data;
        }


    }

})();
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
/**
 * Message preprocessor that parses select markdown notations.
 */
(function () {
    'use strict';

    hl.markdown = function (text) {

        if (!text.trim()) {
            return text;
        }

        // Safe reference.
        var self = function (obj) {
            if (obj instanceof self) {
                return obj;
            }
            if (!(this instanceof self)) {
                return new self(obj);
            }
        };

        // *text* to make bold.
        self.bold = self.bold || /\*([\s\S]+?)\*(?!\*)/gm;
        text = text.replace(self.bold, '<strong>$1</strong>');

        // _text_ to italicize.
        self.it = self.it || /_([\s\S]+?)_(?!_)/gm;
        text = text.replace(self.it, '<em>$1</em>');

        // ~text~ to strike through.
        self.strike = self.strike || /~([\s\S]+?)~(?!~)/gm;
        text = text.replace(self.strike, '<strike>$1</strike>');

        // `text` to preformat.
        self.code = self.code || /`([\s\S]+?)`(?!`)/gm;
        text = text.replace(self.code, '<pre>$1</pre>');

        // >text to quote.
        self.quote = self.quote || /^&gt;(.+)$/gm;
        text = text.replace(self.quote, '<blockquote>$1</blockquote>');

        return text;
    };

})();
/**
 * Parent controller of the account module.
 */
(function () {
    'use strict';

    Base.$inject = ["CommonService", "CommonEvents"];
    angular
        .module('app.account')
        .controller('Base', Base);

    /* @ngInject */
    function Base(CommonService, CommonEvents) {
        var vm = this;
        vm.viewReady = false;

        init();

        function init() {
            console.log('Base Init');
            CommonService.on('$stateChangeStart', function () {
                vm.viewReady = false;
            });
            CommonService.on(CommonEvents.viewReady, function () {
                vm.viewReady = true;
            });
        }
    }

})();
/**
 * Controller for the account Caregiver profile view.
 */
(function () {
    'use strict';

    Caregiver.$inject = ["$scope", "$window", "CommonService", "Session", "AccountRepo", "SiteAlert"];
    angular
        .module('app.account')
        .controller('Caregiver', Caregiver);

    /** @ngInject */
    function Caregiver($scope, $window, CommonService, Session, AccountRepo, SiteAlert) {

        var cvgr = {};
        var vm = this;
        vm.cvgr = cvgr;
        vm.submitBusy = false;
        vm.update = update;

        init();
        function init() {
            vm.submitBusy = true;
            console.log('Update Caregiver Profile');
            AccountRepo.getCaregiver().then(
                function (data) {
                    vm.submitBusy = false;
                    vm.cvgr = data.data.response;
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }

        function update(model) {
            vm.submitBusy = true;
            if (vm.cvgr.public){
                vm.cvgr.public = 'True';
            } else {
                vm.cvgr.public = 'False'
            }
            AccountRepo.updateCaregiver(model).then(
                function (data) {
                    vm.submitBusy = false;
                    SiteAlert.success("Your Caregiver information has been updated.");
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }
    }

})();
/**
 * Controller for the CaregiverProfile view.
 */
(function () {
    'use strict';

    CaregiverProfile.$inject = ["$scope", "$window", "CommonService", "CommonEvents", "Session", "AccountRepo", "SiteAlert", "underscore", "$stateParams"];
    angular
        .module('app.account')
        .controller('CaregiverProfile', CaregiverProfile);

    /** @ngInject */
    function CaregiverProfile($scope, $window, CommonService, CommonEvents, Session, AccountRepo, SiteAlert,
                              underscore, $stateParams) {

        var caregiverProfile = {};
        var vm = this;
        vm.caregiverProfile = caregiverProfile;
        vm.submitBusy = false;
        vm.connect = connect;
        vm.back = back;
        vm.caregiverProfile.email = $stateParams.id;

        init();
        function init() {
            vm.submitBusy = true;
            AccountRepo.caregiver_info(vm.caregiverProfile).then(
                function (data) {
                    vm.submitBusy = false;
                    vm.caregiverProfile = data.data.response;
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }

        function connect() {
            vm.submitBusy = true;
            AccountRepo.connect($stateParams.id).then(
                function (data) {
                    vm.submitBusy = false;
                    SiteAlert.success("Your invitation to " + $stateParams.id + " has been sent and " + $stateParams.id + " has been added to your welcome channel.");
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }

        function back(){
            CommonService.previous();
        }
    }

})();
/**
 * Controller for the CareseekerProfile view.
 */
(function () {
    'use strict';

    CareseekerProfile.$inject = ["$scope", "$window", "CommonService", "CommonEvents", "Session", "AccountRepo", "SiteAlert", "underscore", "$stateParams"];
    angular
        .module('app.account')
        .controller('CareseekerProfile', CareseekerProfile);

    /** @ngInject */
    function CareseekerProfile($scope, $window, CommonService, CommonEvents, Session, AccountRepo, SiteAlert,
                               underscore, $stateParams) {

        var careseekerProfile = {};
        var vm = this;
        vm.careseekerProfile = careseekerProfile;
        vm.submitBusy = false;
        vm.connect = connect;
        vm.back = back;
        vm.careseekerProfile.email = $stateParams.id;

        init();
        function init() {
            vm.submitBusy = true;
            AccountRepo.careseeker_info(vm.careseekerProfile).then(
                function (data) {
                    vm.submitBusy = false;
                    vm.careseekerProfile = data.data.response;
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }

        function connect() {
            vm.submitBusy = true;
            AccountRepo.connect($stateParams.id).then(
                function (data) {
                    vm.submitBusy = false;
                    SiteAlert.success("Your invitation to " + $stateParams.id + " has been sent and " + $stateParams.id + " has been added to your welcome channel.");
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }

        function back(){
            CommonService.previous();
        }

    }

})();
/**
 * Controller for the account edit view.
 */
(function () {
    'use strict';

    Edit.$inject = ["$scope", "$window", "CommonService", "Session", "AccountRepo", "SiteAlert", "underscore"];
    angular
        .module('app.account')
        .controller('Edit', Edit);

    /** @ngInject */
    function Edit($scope, $window, CommonService, Session, AccountRepo, SiteAlert,
                  underscore) {

        var userData = Session.account;
        var profile = underscore.pick(userData, ['username', 'first', 'last', 'email',
            'phone_number', 'email_verified']);

        var vm = this;
        vm.profile = profile;
        vm.submitBusy = false;
        vm.update = update;

        init();
        function init() {
            console.log('Edit Init');
            vm.submitBusy = true;
            AccountRepo.me().then(
                function (data) {
                    vm.submitBusy = false;
                    vm.profile = data.data.response;
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }

        function update(model) {
            vm.submitBusy = true;
            AccountRepo.save(model).then(
                function (data) {
                    vm.submitBusy = false;
                    SiteAlert.success("Your account has been updated.");
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }
    }

})();
/**
 * Controller for the Nearme view.
 */
(function () {
    'use strict';

    Nearme.$inject = ["$scope", "$window", "CommonService", "CommonEvents", "Session", "AccountRepo", "SiteAlert", "underscore"];
    angular
        .module('app.account')
        .controller('Nearme', Nearme);

    /** @ngInject */
    function Nearme($scope, $window, CommonService, CommonEvents, Session, AccountRepo, SiteAlert,
                    underscore) {

        var nearme = {};
        var vm = this;
        vm.nearme = nearme;
        vm.submitBusy = false;
        vm.search = search;

        init();
        function init() {
            vm.submitBusy = true;
            console.log('Get Nearme Profile');

            AccountRepo.search().then(
                function (data) {
                    vm.submitBusy = false;
                    vm.nearme = data.data.response;
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }

        function search(model) {
            vm.submitBusy = true;
            console.log(model);
            AccountRepo.search(model).then(
                function (data) {
                    vm.submitBusy = false;
                    vm.nearme = data.data.response;
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }
    }

})();
(function () {
    'use strict';

    Security.$inject = ["$scope", "SettingsRepo", "AccountRepo", "CommonEvents", "SiteAlert"];
    angular
        .module('app.account')
        .controller('Security', Security);

    /* @ngInject */
    function Security($scope, SettingsRepo,
                      AccountRepo, CommonEvents, SiteAlert) {
        var vm = this;
        vm.settings = null;
        vm.changePassword = changePassword;
        vm.closeAccount = closeAccount;
        vm.password = {};

        vm.errorMessagePasswordChange = null;
        vm.errorMessageAccountClose = null;
        vm.submitBusy = false;

        vm.reasons = [
            {"value": 0, "name": "Duplicate", "description": "I have a duplicate account"},
            {"value": 1, "name": "Don't need", "description": "I don't need the services anymore."},
            {"value": 2, "name": "Different", "description": "I am using a different professional service."},
            {"value": 3, "name": "Other", "description": "Other Reasons"}
        ];

        init();
        function init() {
            console.log('Update password');
        }

        function changePassword(model) {
            vm.submitBusy = true;
            vm.errorMessagePasswordChange = null;

            AccountRepo.resetPassword(model).then(
                function(data){
                    vm.submitBusy = false;
                    SiteAlert.success("Your password has been changed.");
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessagePasswordChange = data;
            });
        }

        function closeAccount(reason) {
            if (window.confirm("Do you really want to close your account?")) {
                vm.submitBusy = true;
                vm.errorMessageAccountClose = null;
                SettingsRepo.closeAccount(reason).then(
                    function (data) {
                        SiteAlert.success("Your account is now closed.");
                        //CommonService.hardRedirect('/logout');
                    },
                    function (data) {
                        vm.submitBusy = false;
                        vm.errorMessageAccountClose = data;
                    });
            }
        }

    }

})();
/**
 * Settings Seeker Controller
 */

angular
    .module('app.account')
    .controller('settingsSeekerCtrl', ['$scope', '$http', 'Constants', 'apiService', 'userSession',
        function ($scope, $http, Constants, apiService, userSession) {

            $scope.aboutMe = {};
            $scope.usr = userSession;
            var account_id = $scope.usr.userdata.account_id;

            var init = function () {
                $http.get('/seeker_profile?account_id=' + account_id)
                    .then(function (response) {
                        $scope.aboutMe = response.data;
                        if (response.data.count === '0') {
                            $scope.siteAlert.type = "success";
                            $scope.siteAlert.message = (response.data.message);
                        }
                    }, function (response) {
                        $scope.siteAlert.type = "danger";
                        $scope.siteAlert.message = ("Oops. " + response.status + " Error. Please try again.");
                    });
                $http({
                    url: '/get_connections',
                    method: "GET",
                    params: {account_id: account_id}
                }).then(function (response) {
                    $scope.connections = response.data;
                }, function (response) {
                    $scope.siteAlert.type = "danger";
                    $scope.siteAlert.message = ("Oops. " + response.status + " Error. Please try again.");
                });

            };
            init();

            $scope.seekerProfileUpdate = function seekerProfileUpdate(model) {
                console.log("account_id : " + account_id);
                angular.extend(model, {'account_id': account_id});

                $http.post('/post_seeker_profile', model)
                    .success(function (data, status) {
                        $scope.siteAlert.type = "success";
                        $scope.siteAlert.message = "Changes have been saved.";
                    })
                    .error(function () {
                        $scope.siteAlert.type = "danger";
                        $scope.siteAlert.message = "Oops. There was an error. Please try again.";
                    });
            };

        }]);
/**
 * Controller for the account Team profile view.
 */
(function () {
    'use strict';

    Team.$inject = ["$scope", "$window", "CommonService", "Session", "AccountRepo", "SiteAlert", "underscore"];
    angular
        .module('app.account')
        .controller('Team', Team);

    /** @ngInject */
    function Team($scope, $window, CommonService, Session, AccountRepo, SiteAlert,
                  underscore) {

        var team = {};
        var vm = this;
        vm.team = team;
        vm.submitBusy = false;
        vm.update = update;

        init();
        function init() {
            vm.submitBusy = true;
            console.log('Get Team Profile');
            AccountRepo.getTeam().then(
                function (data) {
                    vm.submitBusy = false;
                    vm.team = data.data.response;
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }

        function update(model) {
            vm.submitBusy = true;
            if (vm.team.public) {
                vm.team.public = 'True';
            } else {
                vm.team.public = 'False';
            }
            AccountRepo.updateTeam(model).then(
                function (data) {
                    vm.submitBusy = false;
                    SiteAlert.success("Your team information has been updated.");
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }
    }

})();
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Base controller for the accounts module.
 */
angular
    .module('app.account')
    .controller('accountsBaseCtrl', ['$scope', '$window', function ($scope, $window) {

        // CtrlHelper that is shared between the parent and all children.
        $scope.ctrlHelper = new HL.CtrlHelper();

        /**
         * Go back to the previous page/view.
         * @return void
         */
        $scope.previous = function () {
            $window.history.back();
        };

    }]);

/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Controller for caregiver profile page
 */
angular
    .module('app.account')
    .controller('caregiverProfileCtrl', ['$scope', 'apiService', 'userSession',
                function ($scope, apiService, userSession) {

        var caregiverHelper = new HL.CtrlHelper(),
            connectionsHelper = new HL.CtrlHelper();

        caregiverHelper.reset();

        // TODO: Get this from API
        $scope.caregiver = {
            rating: 4,
            background_verified: true,
            community_verified: true,
            badges: {
                care_hours: 2100,
                no_shows: 4,
                beacons_answered: 14
            },
            certifications: [
                'CNA (Schmeiding Center)',
                'Bentonville High School'
            ],
            complements: [
                {
                    name: 'Si Robertson',
                    description: 'Ariana is a wonderful...'
                },
                {
                    name: 'Peter B',
                    description: 'Ariana has been a fantastic help to me and my...'
                },
                {
                    name: 'Jackie C',
                    description: 'Ariana is a lovely caregiver and great at her job!'
                }
            ]
        };

        getInfo();
        $scope.owner = false;

        function getInfo () {
            caregiverHelper.success = function (data, status, headers, config) {
                angular.extend($scope.caregiver, data);
                $scope.caregiver.pictureUrl = 'profile_' + data.first +
                    data.last + '.png';
                $scope.caregiver.bannerUrl = 'banner_' + data.first +
                    data.last + '.png';
            };

            connectionsHelper.success = function (data, status, headers,
                                                  config) {
                $scope.caregiver.connections = data.items;
            };

            apiService.Accounts.get(userSession.userdata.account_id,
                                    caregiverHelper);
            apiService.Connections.my({}, connectionsHelper);
        }
    }]);
/**
 * Press controller
 */
angular
    .module('app.account')
    .controller('connectionsCtrl', ['$scope', '$state', '$http', 'userSession',
        function ($scope, $state, $http, userSession) {

            $scope.connections = {};
            $scope.usr = userSession;
            var account_id = $scope.usr.userdata.account_id;

            var init = function () {
                $http({
                    url: '/get_connections',
                    method: "GET",
                    params: {account_id: account_id}
                }).then(function (response) {
                    $scope.connections = response.data;
                }, function (response) {
                    $scope.siteAlert.type = "danger";
                    $scope.siteAlert.message = ("Oops. " + response.status + " Error. Please try again.");
                });
            };
            init();

            $scope.accept = function (model) {
                $http({
                    url: '/post_connection_accept',
                    method: "POST",
                    params: {to_id: account_id, from_id: model}
                }).then(function (response) {
                    $scope.connections = response.data;
                    $state.reload();
                }, function (response) {
                    $scope.siteAlert.type = "danger";
                    $scope.siteAlert.message = ("Oops. " + response.status + " Error. Please try again.");
                });
            }

        }]);
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Controller for the signup view.
 */
angular
    .module('app.account')
    .controller('joinCtrl', ['$scope', '$window', 'apiService',
        function ($scope, $window, apiService) {

            // Reference to the base ctrlHelper.
            var ctrlHelper = $scope.$parent.ctrlHelper;
            ctrlHelper.reset();

            // Possible ng-switch values.
            var viewModes = ['join_form', 'join_success'];

            $scope.viewMode = viewModes[0];
            $scope.signupModel = {};

            $scope.join = function (model) {
                ctrlHelper.reset();
                if (!validate(model, ctrlHelper)) {
                    return;
                }
                ctrlHelper.success = function (data, status, headers, config) {
                    $scope.viewMode = viewModes[1];
                };
                apiService.Accounts.signup(model, ctrlHelper);
            };

            $scope.cancel = function () {
                $scope.$parent.previous();
            };

            var validate = function (model, ctrlHelper) {
                var errors = [];
                if (!model.email || !model.password || !model.first_name || !model.last_name) {
                    errors.push('All fields are required.');
                }
                if (errors.length) {
                    ctrlHelper.isLoading = false;
                    ctrlHelper.isValid = false;
                    ctrlHelper.errors = errors;
                    return false;
                }
                return true;
            };

        }]);
/**
 * Created by timothybaney on 5/16/16.
 */

/**
 * Controller for the login view.
 */
(function () {
    'use strict';

    Ctrl.$inject = ["$scope", "$window", "$stateParams", "apiService"];
    angular
        .module('app.account')
        .controller('loginCtrl', Ctrl);

    /** @ngInject */
    function Ctrl($scope, $window, $stateParams, apiService) {
        // Reference to the base ctrlHelper.
        var ctrlHelper = $scope.$parent.ctrlHelper;
        ctrlHelper.reset();

        $scope.loginModel = {
            email: '',
            password: ''
        };

        $scope.login = function (model) {
            ctrlHelper.reset();
            if (!model.email || !model.password) {
                return;
            }
            ctrlHelper.success = function (data, status, headers, config) {
                console.log('HEY! Remove the /r absolute URL once migrated to the new backend.');
                var redirector = 'http://eb.humanlink.co/r?url=';
                var next = $stateParams.next || HL.baseUrl + '/accounts#/settings/profile';
                //$window.location.href = redirector + decodeURIComponent(next);
                $window.location.href = '/home#/search';
            };
            apiService.Accounts.login(model, ctrlHelper);
        };
    }

})();
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

angular
    .module('app.account')
    .controller('providerEditCtrl', ['$scope', '$http', 'Constants', 'apiService', 'userSession',
        function ($scope, $http, Constants, apiService, userSession) {

            $scope.aboutMe = {};
            $scope.usr = userSession;
            var account_id = $scope.usr.userdata.account_id;

            var init = function () {
                $http.get('/get_caregiver_profile?account_id=' + account_id)
                    .then(function (response) {
                        $scope.aboutMe = response.data;
                        if (response.data.count === '0') {
                            $scope.siteAlert.type = "success";
                            $scope.siteAlert.message = (response.data.message);
                        }
                    }, function (response) {
                        $scope.siteAlert.type = "danger";
                        $scope.siteAlert.message = ("Oops. " + response.status + " Error. Please try again.");
                    });
            };
            init();

            $scope.caregiverProfileUpdate = function caregiverProfileUpdate(model) {
                console.log("account_id : " + account_id);
                angular.extend(model, {'account_id': account_id});

                $http.post('/post_caregiver_profile', model)
                    .success(function (data, status) {
                        $scope.siteAlert.type = "success";
                        $scope.siteAlert.message = "Changes have been saved.";
                        $scope.showCaregiverForm = false;
                    })
                    .error(function () {
                        $scope.siteAlert.type = "danger";
                        $scope.siteAlert.message = "Oops. There was an error. Please try again.";
                    });
            };

        }]);
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Press controller
 */
angular
    .module('app.account')
    .controller('providerPreviewCtrl', ['$scope', 'userSession', '$http',
        function ($scope, userSession, $http) {

            $scope.profile = {};
            $scope.usr = userSession;
            var account_id = $scope.usr.userdata.account_id;
            var email = $scope.usr.userdata.email;

            var init = function () {
                $http({
                    url: '/caregiver_profile',
                    method: "GET",
                    params: {account_id: account_id}
                }).then(function (response) {
                    $scope.profile = response.data;
                }, function (response) {
                    $scope.siteAlert.type = "danger";
                    $scope.siteAlert.message = ("Oops. " + response.status + " Error. Please try again.");
                });
            };
            init();

        }]);
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Controller for the password reset
 */
angular
    .module('app.account')
    .controller('resetCtrl', ['$scope', '$http', function ($scope, $http) {

        var viewModes = ['construction', 'reset_form', 'reset_sent'];
        $scope.viewMode = viewModes[0];

        $scope.resetModel = {
            email: ''
        };

        $scope.reset = function (model) {
            $http.post('/reset', model)
                .success(function (data, status) {
                    $scope.viewMode = viewModes[1];
                })
                .error(function () {
                    $scope.siteAlert.type = "danger";
                    $scope.siteAlert.message = "Oops. There was a problem. Please try again.";
                });
        };

    }]);
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Controller for the password reset
 */
angular
    .module('app.account')
    .controller('resetPasswordCtrl', ['$scope', '$http', function ($scope, $http) {
        $scope.passwordModel = {};
        var viewModes = ['working', 'construction'];
        $scope.viewMode = viewModes[1];

        $scope.resetPassword = function (model) {
            if (!validate(model)) {
                return;
            }

            $http.post('/reset_password', model)
                .success(function (data, status) {
                    $scope.siteAlert.type = "success";
                    $scope.siteAlert.message = "Your password was updated.";
                })
                .error(function () {
                    $scope.siteAlert.type = "danger";
                    $scope.siteAlert.message = "Oops. There was a problem. Please try again.";
                });
        };

        var validate = function (model) {
            if (!model.password || !model.password_confirm) {
                $scope.siteAlert.type = "danger";
                $scope.siteAlert.message = "All fields are required.";
                return false;
            }
            if (model.password !== model.password_confirm) {
                $scope.siteAlert.type = "danger";
                $scope.siteAlert.message = "Password does not match the confirmation.";
                return false;
            }
            return true;
        };

    }]);
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Controller for the favorite caregivers sub-page of settings
 */
(function () {
    Ctrl.$inject = ["$scope"];
    angular
        .module('app.account')
        .controller('settingsFavoritesCtrl', Ctrl);

    /** @ngInject */
    function Ctrl($scope) {
        $scope.favorites = [
            {"name": "Jane Caregiver", "status": "I am currently available from M-F from 9-5"},
            {"name": "Sarah Caregiver", "status": "I am available for live-in and live-out"},
            {"name": "Zoe Caregiver", "status": "I am on vacation till August 15th"},
            {"name": "Amanda Caregiver", "status": "I am on vacation till August 10th"},
        ];
    }

})();
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Controller for the media subpage of settings
 */
angular
    .module('app.account')
    .controller('settingsMediaCtrl', ['$scope', function ($scope) {
    }]);
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
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';
(function () {
    Ctrl.$inject = ["$scope", "$state", "Constants", "apiService", "siteAlert"];
    angular
        .module('app.account')
        .controller('settingsRecipientsCtrl', Ctrl);

    /** @ngInject */
    function Ctrl($scope, $state, Constants, apiService, siteAlert) {

        $scope.recipients = null;
        $scope.edit = edit;
        $scope.archive = archive;

        init();
        function init() {
            var initReq = new HL.CtrlHelper();
            initReq.success = function (data, status) {
                $scope.recipients = data.items || [];
            };
            initReq.failure = function (data, status) {
                siteAlert.error(data);
            };
            apiService.Accounts.patients.list(initReq);
        }

        function edit(model) {
            $state.go('settings.new_recipient.who', {model: model});
        }

        function archive(model) {
            siteAlert.clear();
            if (!window.confirm("Are you sure?")) {
                return;
            }
            model.isLoading = true;
            var archiveReq = new HL.CtrlHelper();
            var ind = $scope.recipients.indexOf(model);
            $scope.recipients.splice(ind, 1);

            // Restore.
            archiveReq.failure = function (data, status) {
                siteAlert.error('Care recipient could not be archived.');
                model.isLoading = false;
                $scope.recipients.splice(ind, 0, model);
            };
            apiService.Accounts.patients.remove(model.id, archiveReq);
        }
    }

})();
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Controller for the references subpage of settings
 */
angular
    .module('app.account')
    .controller('settingsReferencesCtrl', ['$scope', function ($scope) {
        $scope.addReference = function(name, email) {
            $scope.account.references.push({ name: name, email: email });
        };

        $scope.account = {
            references: [
                {
                    name: 'Si Robertson',
                    email: 'sroberston@gmail.com'
                },
                {
                    name: 'Wayne Hoyt',
                    email: 'whoyt@gmail.com'
                },
                {
                    name: 'Reynold Grover',
                    email: 'rgrover@gmail.com'
                }
            ]
        };
    }]);
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
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Controller for the verification subpage of settings
 */
angular
    .module('app.account')
    .controller('settingsVerificationCtrl', ['$scope', function ($scope) {

        $scope.account = {
            emailVerified: true,
            phoneVerified: true,
            backgroundVerified: false
        };

        $scope.states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC',
            'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
            'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
            'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD',
            'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
        $scope.chosenDLState = $scope.states[0];
        $scope.chosenAddrState = $scope.states[0];
    }]);
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Base controller for the home module.
 */
angular
    .module('Admin')
    .controller('adminBaseCtrl', ['$scope', '$http', 'userSession',
        function ($scope, $http, userSession) {

        }]);
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Base controller for the home module.
 */
angular
    .module('Admin')
    .controller('passwordCtrl', ['$scope', '$http', 'userSession',
        function ($scope, $http, userSession) {

            $scope.updatePassword = function (model) {
                $http.post('/post_admin_password', model)
                    .success(function (data, status) {
                        $scope.siteAlert.type = "success";
                        $scope.siteAlert.message = "Your settings were updated successfully.";
                    })
                    .error(function () {
                        $scope.siteAlert.type = "danger";
                        $scope.siteAlert.message = "Oops. There was a problem. Please try again.";
                    });

            };

        }]);
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Base controller for the home module.
 */
angular
    .module('Admin')
    .controller('verificationCtrl', ['$scope', '$http', '$window', 'userSession',
        function ($scope, $http, $window, userSession) {

            $scope.verificationModel = {};
            $scope.usr = userSession;
            var account_email = $scope.usr.userdata.email;

            $scope.getVerification = function (model) {
                $http({
                    url: '/get_admin_verification',
                    method: "GET",
                    params: {email: model.email, account_email: account_email}
                }).then(function (response) {
                    $scope.verificationModel = response.data;
                }, function (response) {
                    $scope.siteAlert.type = "danger";
                    $scope.siteAlert.message = ("Oops. " + response.status + " Error. Please try again.");
                });
            };

            $scope.updateVerification = function (model) {
                console.log(model);
                $http.post('/post_admin_verification', model)
                    .success(function (data, status) {
                        $scope.siteAlert.type = "success";
                        $scope.siteAlert.message = "Your settings were updated successfully.";
                    })
                    .error(function () {
                        $scope.siteAlert.type = "danger";
                        $scope.siteAlert.message = "Oops. There was a problem. Please try again.";
                    });

            };
        }]);

/**
 * Created by timothybaney on 5/16/16.
 */

angular
    .module('Common')
    .constant('Constants', window.HL.constants);
/**
 * Created by timothybaney on 5/16/16.
 */

/**
 * Keeps track of the current logged in user.
 */
(function () {
    angular
        .module('Common')
        .provider('userSession', function () {

            getUserSession.$inject = ["apiService"];
            var roles = {
                GUEST: 0,
                AUTHORIZED: 1
            };

            return {
                // This is here because it us used in `angular.config()`.
                roles: roles,
                $get: getUserSession
            };

            /** ngInject */
            function getUserSession(apiService) {
                var userdata = null;
                var ctrlHelper = new HL.CtrlHelper();

                // Initial page load.
                if (window.HL.userdata) {
                    userdata = window.HL.userdata;
                }

                return {
                    roles: roles,
                    userdata: userdata,
                    setAccount: setAccount,
                    unsetAccount: unsetAccount,
                    isAuthorized: isAuthorized,
                    update: update,
                    getRole: getRole
                };

                function setAccount(account) {
                    userdata = account;
                }

                function unsetAccount() {
                    userdata = null;
                }

                function isAuthorized() {
                    return userdata !== null;
                }

                function update() {
                    ctrlHelper.success = function (data, status, headers, config) {
                        userdata = data;
                    };
                    ctrlHelper.error = function () {
                        unsetAccount();
                    };
                    apiService.Accounts.userdata({}, ctrlHelper);
                }

                /**
                 * Returns roles.GUEST or roles.AUTHORIZED.
                 * In the future, this should be used for checking account type as well.
                 */
                function getRole() {
                    return isAuthorized() ? roles.AUTHORIZED : roles.GUEST;
                }
            }
        });

})();
/**
 * Service that keeps track of the current logged in user.
 */
(function () {
    'use strict';

    angular
        .module('app.common')
        .provider('Session', Session);

    function Session() {

        SessionService.$inject = ["AccountRepo"];
        var roles = {
            GUEST: 0,
            AUTHORIZED: 1
        };

        return {
            roles: roles,
            $get: SessionService
        };

        function SessionService(AccountRepo) {
            var self = this;

            // Initial page load.
            // TODO: Rename this to window.hl.account
            self.account = window.HL.userdata;

            return {
                roles: roles,
                account: self.account,
                isAuthorized: isAuthorized,
                update: update
            };

            /**
             * Refreshes the user information from the server.
             * @return {Promise}
             */
            function update() {
                return AccountRepo.me().then(
                    function (data) {
                        self.account = data;
                    },
                    function (error) {
                        self.account = null;
                    }
                );
            }

            /**
             * Returns whether or not the current user is logged in.
             * @return {boolean}
             */
            function isAuthorized() {
                return angular.isObject(self.account);
            }
        }

    }

})();
/**
 * Service that controls the site alert that is attached to the root scope.
 *
 * Site alerts are alert messages that are displayed at the top of the website.
 * They are useful for displaying one-time (flash) messages.
 *
 * Future enhancements:
 *  - Inject HTML
 *  - Auto-dismiss
 */

(function () {
    'use strict';

    SiteAlert.$inject = ["$rootScope"];
    angular
        .module('app.common')
        .factory('SiteAlert', SiteAlert);

    /** ngInject */
    function SiteAlert($rootScope) {

        $rootScope.siteAlert = {};

        var alertBox = $rootScope.siteAlert;

        return {
            clear: clear,
            success: success,
            error: danger,
            danger: danger,
            warning: warning,
            info: info,
            check: checkAlert,
        };

        function checkAlert(){
            console.log(alertBox)
        }

        function clear() {
            addAlert(null, null);
        }

        function success(content) {
            addAlert('success', content);
        }

        function danger(content) {
            addAlert('danger', content);
        }

        function warning(content) {
            addAlert('warning', content);
        }

        function info(content) {
            addAlert('info', content);
        }

        function addAlert(type, content) {
            alertBox.type = type;
            alertBox.message = content;
        }
    }

})();
/**
 * API Service that talks to the backend.
 */
angular
    .module('Common')
    .factory('apiService', ['$http', function ($http) {

        // Google Cloud Endpoints URL.
        var getGceBase = function () {
            var host = window.location.host;
            // GCE doesn't work with custom domains.
            if (host.indexOf('humanlink.co') === 0) {
                host = 'care-tiger.appspot.com';
            }
            var protocol = host.indexOf('localhost') === 0 ? 'http://' : 'https://';
            return protocol + host + '/_ah/api/humanlink/v1/';
        };

        var GCE_BASE = getGceBase();

        var Accounts = {
            caregiver: {},
            patients: {}
        };
        var Connections = {};
        var Home = {};

        /**
         * Base method to communicate with the APIs.
         *
         * @param method : 'GET' or 'POST'
         * @param uri : relative path to the base URL or GCE URL
         * @param data : request data
         * @param ctrlHelper : CtrlHelper with callbacks
         * @param useEndpoints : whether this is a GCE API or not.
         */
        var apiRequest = function (method, uri, data, ctrlHelper, useEndpoints) {
            ctrlHelper.isLoading = true;
            ctrlHelper.isValid = true;
            ctrlHelper.errors = [];

            // Use endpoints by default.
            if (!angular.isDefined(useEndpoints)) {
                useEndpoints = true;
            }

            $http({
                method: method,
                url: (useEndpoints ? GCE_BASE : '/') + uri,
                data: data
            })
                .success(function (data, status, headers, config) {
                    ctrlHelper.isLoading = false;
                    if (angular.isFunction(ctrlHelper.success)) {
                        ctrlHelper.success(data, status, headers, config);
                    }
                    if (angular.isFunction(ctrlHelper.always)) {
                        ctrlHelper.always(data, status, headers, config);
                    }
                })
                .error(function (data, status, headers, config) {
                    ctrlHelper.isLoading = false;
                    if (angular.isFunction(ctrlHelper.failure)) {
                        ctrlHelper.failure(data, status, headers, config);
                    }
                    if (angular.isFunction(ctrlHelper.always)) {
                        ctrlHelper.always(data, status, headers, config);
                    }
                });
        };

        Accounts.login = function (data, ctrlHelper) {
            apiRequest('POST', 'login.json', data, ctrlHelper, false);
        };

        Accounts.signup = function (data, ctrlHelper) {
            apiRequest('POST', 'signup.json', data, ctrlHelper, false);
        };

        Accounts.userdata = function (data, ctrlHelper) {
            apiRequest('GET', 'accounts/userdata.json', data, ctrlHelper, false);
        };

        Accounts.get = function (id, ctrlHelper) {
            apiRequest('GET', 'accounts/' + id, {}, ctrlHelper, true);
        };

        Accounts.update = function (data, ctrlHelper) {
            apiRequest('POST', 'accounts/update', data, ctrlHelper, true);
        };

        Accounts.caregiver.get = function (accountId, ctrlHelper) {
            apiRequest('GET', 'accounts/caregiver', {}, ctrlHelper, true);
        };

        Accounts.caregiver.update = function (data, ctrlHelper) {
            apiRequest('POST', 'accounts/caregiver/update', data, ctrlHelper, true);
        };

        Accounts.patients.list = function (ctrlHelper) {
            apiRequest('GET', 'accounts/patients/list', {}, ctrlHelper, true);
        };

        Accounts.patients.update = function (data, ctrlHelper) {
            apiRequest('POST', 'accounts/patients/update', data, ctrlHelper, true);
        };

        Accounts.patients.remove = function (patient_id, ctrlHelper) {
            var data = {patient_id: patient_id};
            apiRequest('POST', 'accounts/patients/remove', data, ctrlHelper, true);
        };

        Home.contact = function (data, ctrlHelper) {
            apiRequest('POST', 'contact.json', data, ctrlHelper, false);
        };

        Connections.my = function (data, ctrlHelper) {
            apiRequest('GET', 'connections/my', data, ctrlHelper, true);
        };

        Home.search = function (data, ctrlHelper) {
            apiRequest('GET', 'home/search', data, ctrlHelper, false);
        };

        // Public methods.
        return {
            Accounts: Accounts,
            Connections: Connections,
            Home: Home
        };

    }]);

angular
    .module('Common')
    .constant('Constants', window.HL.constants);
/**
 * Parent controller of the dashboard module.
 */
(function () {
    'use strict';

    Base.$inject = ["CommonService", "CommonEvents"];
    angular
        .module('app.dashboard')
        .controller('Base', Base);

    /** @ngInject */
    function Base(CommonService, CommonEvents) {
        var vm = this;
        vm.viewReady = false;

        init();

        function init() {
            CommonService.on('$stateChangeStart', function () {
                vm.viewReady = false;
            });
            CommonService.on(CommonEvents.viewLoading, function () {
                vm.viewReady = false;
            });
            CommonService.on(CommonEvents.viewReady, function () {
                vm.viewReady = true;
            });
        }
    }

})();
/**
 * Create thread controller.
 */
(function () {
    'use strict';

    CreateThread.$inject = ["$log", "CommonService", "MessagesRepo"];
    angular
        .module('app.dashboard')
        .controller('CreateThread', CreateThread);

    /** @ngInject */
    function CreateThread($log, CommonService, MessagesRepo) {
        var vm = this;

        vm.errorMessage = null;
        vm.submitBusy = false;

        vm.thread = null;
        vm.createThread = createThread;
        vm.cancel = cancel;


        init();

        function init() {
            $log.debug('create_thread init');
            vm.type = 'option1';

            //has to be move to constants file
            vm.careServices = [
                {
                    "value": 0,
                    "name": "Companion",
                    "description": "Companionship",
                    "skills": "All things companions do"
                },
                {
                    "value": 1,
                    "name": "Grooming",
                    "description": "Personal Grooming",
                    "skills": "Bathing and dressing"
                },
                {
                    "value": 2,
                    "name": "Meals",
                    "description": "Meal Preparations",
                    "skills": "Hot/cold meal preparations"
                },
                {
                    "value": 3,
                    "name": "Housekeeping",
                    "description": "Housekeeping",
                    "skills": "Housekeeping - Laundry and cleaning"
                },
                {
                    "value": 4,
                    "name": "Medication",
                    "description": "Medication reminders",
                    "skills": "Medication reminders"
                },
                {
                    "value": 5,
                    "name": "Transportation",
                    "description": "Transportation",
                    "skills": "Transportation from home to clinic and back"
                },
                {
                    "value": 6,
                    "name": "Alzheimers",
                    "description": "Alzheimer's and Dementia",
                    "skills": "Companionship, Mental simulation, 24-hour care"
                },
                {
                    "value": 7,
                    "name": "Mobility",
                    "description": "Mobility assistance",
                    "skills": "Mobility assistance"
                }
            ];
        }

        function createThread(model) {
            vm.submitBusy = true;
            model = {
                name: model.name,
                purpose: model.purpose
            };

            MessagesRepo.create(model).then(
                function (thread) {
                    console.log(thread.owner);
                    CommonService.hardRedirect('/app/c/' + thread.owner.id + '/' + thread.name);
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }

        function cancel() {
            CommonService.previous();
        }

    }

})();
/**
 * Controller for the sidebar view.
 */
(function () {
    'use strict';

    Sidebar.$inject = ["$scope", "$log", "MessagesService"];
    angular
        .module('app.dashboard')
        .controller('Sidebar', Sidebar);

    /** @ngInject */
    function Sidebar($scope, $log, MessagesService) {
        var vm = this;
        vm.orgs = null;

        init();

        function init() {

            MessagesService.getThreads().then(function (threads) {
                $log.debug('sidebar init');
                vm.threads = threads;
            });
        }
    }

})();
/**
 * Controller for the dashboard welcome state.
 */
(function () {
    'use strict';

    Welcome.$inject = ["$log", "NotificationManager"];
    angular
        .module('app.dashboard')
        .controller('Welcome', Welcome);

    /** @ngInject */
    function Welcome($log, NotificationManager) {
        var vm = this;
        vm.nagDesktopNotifications = !NotificationManager.isGranted();

        vm.enableNotifications = enableNotifications;

        init();

        function init() {
            $log.debug('welcome init');
            if (NotificationManager.permission === 'denied') {
                vm.view = 'denied';
            }
        }

        function enableNotifications() {
            vm.view = 'hints';
            NotificationManager.requestPermission().then(function (permission) {
                vm.view = permission;
            });
        }
    }

})();
/**
 *
 */
(function () {
    'use strict';

    AccountService.$inject = ["$log", "$q", "Session"];
    angular
        .module('app.dashboard')
        .factory('AccountService', AccountService);

    /** @ngInject */
    function AccountService($log, $q, Session) {

        return {
            isAccountMe: isAccountMe,
            accountName: getAccountName
        };

        /**
         * Checks if the account ID is the same as the logged in user's.
         *
         * @param accountId:
         * @return {Account|false}
         */
        function isAccountMe(accountId) {
            return Session.account.id === parseInt(accountId);
        }

        /**
         * Returns account name.
         * @param member: Account object
         * @returns {String}
         */
        function getAccountName(profile) {
            if (profile.name.trim()) {
                return profile.name;
            }
            var name = profile.first;
            if (profile.last) {
                name += ' ' + profile.last;
            }
            if (!name) {
                name = profile.username || profile.email || 'Unnamed';
            }
            profile.name = name;
            return name;
        }
    }
})();

/**
 * Provides an interface to register thread message formatters such
 * as markdown, autolinks, mentions, URL previews, etc.
 */
(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .factory('MessageFormatter', MessageFormatter);

    /** ngInject */
    function MessageFormatter() {

        var fact = {};

        /**
         * Array of functions to execute whenever the `run` method is called.
         * The functions are called in array order, each passing its return
         * value through to the next.
         */
        fact.formatters = [];
        fact.run = run;

        return fact;

        function run(value) {
            fact.formatters.forEach(function (fmt) {
                value = fmt(value);
            });
            return value;
        }

    }

})();
/**
 * Messages service.
 */
(function () {
    'use strict';

    MessagesService.$inject = ["$q", "$log", "$state", "underscore", "MessagesRepo"];
    angular
        .module('app.dashboard')
        .factory('MessagesService', MessagesService);

    /** ngInject */
    function MessagesService($q, $log, $state, underscore, MessagesRepo) {
        var self = this;

        var cache = {
            threads: null,
            threadsIndexed: null,
            // thread_id => messages mapping.
            messages: {}
        };

        return {
            append: append,
            getThreads: getThreads,
            getHistory: getHistory,
            getThreadInfo: getThreadInfo,
            send: send,
            navigateToThread: navigateToThread
        };

        /**
         * Returns list of threads the user is member of.

         * @param forceRemote: if true, forces a remote request.
         * @return {Promise -> Array}
         */
        function getThreads(forceRemote) {
            if (cache.threads && !forceRemote) {
                return $q.when(cache.threads);
            }
            return MessagesRepo.fetchThreads()
                .then(function (threads) {
                threads.threads.forEach(function (thread) {
                    thread.membersIndexed = underscore.indexBy(thread.members, 'account');
                });

                cache.threads = underscore.sortBy(threads, 'name');
                cache.threadsIndexed = underscore.indexBy(threads.threads, 'id');

                return cache.threads;
            });
        }

        /**
         * Returns a cached thread history.
         *
         * The content of the array may change after the return call.
         * (e.g a message is posted or removed).
         *
         * Be careful modifying the content of the returned array as it
         * may have side affects.
         *
         * @param threadId
         * @param forceRemote: if true, forces a remote request.
         *
         * @return {Promise -> Array} messages
         */
        function getHistory(threadId, forceRemote) {
            threadId = parseInt(threadId);
            if (cache.messages[threadId] && !forceRemote) {
                    return $q.when(cache.messages[threadId]);
            }
            return MessagesRepo.fetchHistory(threadId).then(function (thread) {
                cache.messages[threadId] = thread.all_chats.slice().reverse();
                return cache.messages[threadId];
            });
        }

        /**
         * Appends a message to the end of the cached messages.
         *
         * @param threadId
         * @param message
         * @return {Promise -> Array}
         */
        function append(threadId, message) {
            threadId = parseInt(threadId);
            return getHistory(threadId).then(function (messages) {
                if (!messages) {
                    $log.warn('Trying to append to a non-existing thread.');
                    return;
                }

                message = JSON.parse(message);

                var newMessage = {
                    'account': {
                        'gravatar_url': message['gravatar_url'],
                        'name': message['name']
                    },
                    'created': message['created'],
                    'kind': 0,
                    'remover': null,
                    'text': message['text']

                }

                console.log(message);
                //console.log('messages before');
                //console.log(messages);
                messages.push(newMessage);
                //console.log('messages after');
                console.log(messages);
                return messages;
            });
        }

        /**
         * Post a new message to a thread.
         *
         * TODO: add a temporary message while sending is in progress.
         *
         * @param model
         * @return {Promise -> Object}
         */
        function send(threadId, model) {
            threadId = parseInt(threadId);
            return MessagesRepo.send(threadId, model);
        }

        /**
         * Returns cached thread information.
         *
         * @param threadId
         * @return {Thread}
         */
        function getThreadInfo(threadId) {
            threadId = parseInt(threadId);
            console.log(threadId)
            return cache.threadsIndexed[threadId];
        }

        /**
         * Navigates to a thread view.
         * @param threadId
         */
        function navigateToThread(threadId) {
            var thread = getThreadInfo(threadId);
            return $state.go('dashboard.messages', {
                threadId: thread.id,
                owner: thread.owner.id,
                thread: thread.name
            });
        }
    }

})();
/**
 * HTML5 notifications.
 * Docs: https://developer.mozilla.org/en-US/docs/Web/API/notification
 *
 * This service is a generic wrapper around the HTML5 Notification API.
 */
(function () {
    'use strict';

    NotificationManager.$inject = ["$window", "$timeout", "$q"];
    angular
        .module('app.dashboard')
        .factory('NotificationManager', NotificationManager);

    /** ngInject */
    function NotificationManager($window, $timeout, $q) {

        var notif = {
            permission: null,
            isGranted: isGranted,
            requestPermission: requestPermission,
            showNotification: showNotification
        };

        if ($window.Notification) {
            notif.permission = Notification.permission;
        }

        return notif;

        /**
         * Wraps `Notification.requestPermission` in a promise;
         * @return {Promise}
         */
        function requestPermission() {
            var defer = $q.defer();

            if (!$window.Notification) {
                return defer.reject('HTML5 Notification not supported.');
            }
            if (isGranted()) {
                return defer.resolve(Notification.permission);
            }
            Notification.requestPermission(function (permission) {
                if (Notification.permission != permission) {
                    Notification.permission = permission;
                }
                notif.permission = permission;
                return defer.resolve(permission);
            });

            return defer.promise;
        }

        /**
         * Displays a notification for 10 seconds.
         *
         * See `window.Notification` for argument descriptions.
         *
         * @return {window.Notification | undefined}
         */
        function showNotification(title, options, onclick) {
            if ($window.document.hasFocus() || !isGranted()) {
                return;
            }
            var n = new Notification(title, options);
            if (angular.isFunction(onclick)) {
                n.onclick = onclick;
            }
            $timeout(n.close.bind(n), 10000);
            return n;
        }

        function isGranted() {
            return $window.Notification && Notification.permission === 'granted';
        }

    }

})();
/**
 * Notifications service.
 */
(function () {
    'use strict';

    Notifications.$inject = ["$window", "AccountService", "MessagesService", "NotificationManager"];
    angular
        .module('app.dashboard')
        .factory('Notifications', Notifications);

    /** ngInject */
    function Notifications($window, AccountService, MessagesService,
                           NotificationManager) {

        return {
            newMessage: newMessage
        };

        /**
         * Displays a new message notification.
         * @param threadId
         * @param chat
         */
        function newMessage(threadId, chat) {
            if (!displayOk() || chat.kind !== 0 || AccountService.isAccountMe(chat.account_id)) {
                return;
            }
            var thread = MessagesService.getThreadInfo(threadId);
            var account = thread.membersIndexed[chat.account_id];
            var title = thread.name;
            var body = AccountService.accountName(account.profile) + ': ' + chat.text;

            NotificationManager.showNotification(title, {
                body: body,
                icon: thread.membersIndexed[chat.account_id].profile.gravatar_url,
                tag: 'main'
            }, onclick);

            function onclick() {
                $window.focus();
                MessagesService.navigateToThread(thread.id);
            }
        }

        function displayOk() {
            return !$window.document.hasFocus() && NotificationManager.isGranted();
        }

    }

})();
/**
 * Various helper methods for working with orgs and org members.
 */
(function () {
    'use strict';

    OrgService.$inject = ["$q", "underscore", "OrgsRepo", "Session"];
    angular
        .module('app.dashboard')
        .factory('OrgService', OrgService);

    /** @ngInject */
    function OrgService($q, underscore, OrgsRepo, Session) {

        var cache = {
            orgs: null,
            allThreads: {},
            allMembers: {}
        };

        return {
            cache: cache,
            getSummary: getSummary,
            getOrgByUsername: getOrgByUsername
        };

        /**
         * Gets org summary.
         *
         * @return {Promise}
         */
        function getSummary() {
            if (cache.orgs) {
                return $q.when(cache.orgs);
            }
            return OrgsRepo.fetchSummary().then(function (orgs) {
                orgs.all_orgs.forEach(butter);
                cache.orgs = orgs.all_orgs;
                return cache.orgs;
            });

            function butter(org) {
                if (org.members) {
                    org.membersIndexed = underscore.indexBy(org.members, 'id');
                    angular.extend(cache.allMembers, org.membersIndexed);
                }
                if (org.threads) {
                    org.threads = underscore.sortBy(org.threads, 'name');
                    org.threadsIndexed = underscore.indexBy(org.threads, 'id');
                    angular.extend(cache.allThreads, org.threadsIndexed);
                }
                return org;
            }
        }

        /**
         * Returns an org by username.
         * @param username
         * @return {Promise}
         */
        function getOrgByUsername(username) {
            return getSummary().then(function (orgs) {
                return underscore.findWhere(orgs, {username: username});
            });
        }

    }

})();
/**
 * Dashboard push notification listeners.
 *
 * This service is responsible for listening and dispatching events
 * that were sent from Pusher.
 */
(function () {
    'use strict';

    PushListener.$inject = ["$log", "$rootScope", "CommonService", "Notifications", "MessagesService"];
    angular
        .module('app.dashboard')
        .factory('PushListener', PushListener);

    /** ngInject */
    function PushListener($log, $rootScope, CommonService,
                          Notifications, MessagesService) {

        var EVENTS = {
            newMessage: 'message.new',
            threadCreated: 'thread.created'

        };

        // New message listener.
        CommonService.on(EVENTS.newMessage, onNewMessage);

        return {
            bindAndListen: bindAndListen
        };

        /**
         * Bind pre-defined user events to the given Pusher channel.
         *
         * This method simply re-broadcasts those events at the $rootScope level
         * so that anybody can subscribe at an application level.
         *
         * @param channel user's private channel
         */
        function bindAndListen(channel) {
            angular.forEach(EVENTS, function (name, key) {
                channel.bind(name, function (data) {
                    CommonService.broadcast(name, data);
                    digest();
                });
            });
        }

        function onNewMessage(scope, data) {
            $log.debug(EVENTS.newMessage + ': on');
            MessagesService.append(data.thread_id, data.chat);
            Notifications.newMessage(data.thread_id, data.chat);
        }

        function digest () {
            $rootScope.$digest();
        }

    }

})();

/**
 *  Controller for the team view.
 */
(function () {
    'use strict';

    Directory.$inject = ["$log", "OrgService", "orgInfo"];
    angular
        .module('app.dashboard.team')
        .controller('Directory', Directory);

    /** @ngInject */
    function Directory($log, OrgService, orgInfo) {
        var vm = this;

        vm.org = null;
        vm.memberName = memberName;

        init();

        function init() {
            $log.debug('directory init');
            vm.org = orgInfo;
        }

        function memberName(member) {
            return OrgService.memberName(member);
        }
    }

})();
/**
 *  Controller for the invite view.
 */
(function () {
    'use strict';

    Invite.$inject = ["$log", "CommonService", "SiteAlert", "OrgsRepo", "orgInfo"];
    angular
        .module('app.dashboard.team')
        .controller('OrgInvite', Invite);

    /** @ngInject */
    function Invite($log, CommonService, SiteAlert, OrgsRepo, orgInfo) {
        var vm = this;

        vm.org = null;
        vm.errorMessage = null;
        vm.submitBusy = false;

        vm.sendInvite = sendInvite;
        vm.cancelInvite = cancelInvite;
        vm.invite = null;

        init();

        function init() {
            $log.debug('invite init');
            vm.org = orgInfo;
        }

        function sendInvite(model) {
            vm.submitBusy = true;
            vm.errorMessage = null;

            OrgsRepo.sendInvite(vm.org.id, model).then(
                function (data) {
                    vm.submitBusy = false;
                    SiteAlert.success("Your invite has been sent to " + model.email);
                    vm.invite = null;
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }

        function cancelInvite() {
            CommonService.previous();
        }
    }

})();
/**
 *  Controller for the team view.
 */
(function () {
    'use strict';

    Team.$inject = ["$log", "orgInfo"];
    angular
        .module('app.dashboard.team')
        .controller('Team', Team);

    /** @ngInject */
    function Team($log, orgInfo) {
        var vm = this;

        init();

        function init() {
            $log.debug('team init');
            vm.org = orgInfo;
        }

    }

})();
/**
 *  Controller for the thread Archive.
 */
(function () {
    'use strict';

    Archive.$inject = ["$scope", "$log", "$state", "CommonService", "CommonEvents", "MessagesRepo", "threadInfo"];
    angular
        .module('app.dashboard.thread')
        .controller('Archive', Archive);

    /** @ngInject */
    function Archive($scope, $log, $state,
                     CommonService, CommonEvents,
                     MessagesRepo, threadInfo) {
        var vm = this;
        vm.errorMessage = null;
        vm.submitBusy = false;

        vm.thread = null;
        vm.archive = archive;
        vm.cancel = cancel;

        init();

        function init() {
            $log.debug('Archive init');
            vm.thread = threadInfo.thread;

            CommonService.broadcast(CommonEvents.viewReady);
        }

        function archive() {
            vm.submitBusy = true;
            vm.errorMessage = null;

            MessagesRepo.archive(vm.thread.id).then(
                function () {
                    vm.submitBusy = false;
                    $state.go('dashboard.default');
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }

        function cancel() {
            CommonService.previous();
        }
    }

})();
/**
 *  Controller for the thread Info.
 */
(function () {
    'use strict';

    Info.$inject = ["$scope", "$log", "$window", "CommonService", "CommonEvents", "MessagesRepo", "threadInfo"];
    angular
        .module('app.dashboard.thread')
        .controller('Info', Info);

    /** @ngInject */
    function Info($scope, $log, $window,
                  CommonService, CommonEvents,
                  MessagesRepo, threadInfo) {
        var vm = this;
        vm.errorMessage = null;
        vm.submitBusy = false;

        vm.thread = null;
        vm.removeMember = removeMember;

        init();

        function init() {
            $log.debug('Info init');
            vm.thread = threadInfo.thread;
            vm.members = threadInfo.members;

            CommonService.broadcast(CommonEvents.viewReady);
        }

        function removeMember(threadId, memberId) {
            if ($window.confirm('You are trying to remove a member. Are you sure?')) {
                var model = {
                    thread_id: threadId,
                    member_id: memberId
                };
                vm.submitBusy = true;
                MessagesRepo.removeMember(model).then(
                    function (data) {
                        $log.debug("Removed member " + vm.thread.member.name);
                    },
                    function (data) {
                        vm.submitBusy = false;
                        vm.errorMessage = data;
                        $log.debug(vm.errorMessage);
                    });

            }
        }

    }

})();
/**
 *  Controller for the thread Invite.
 */
(function () {
    'use strict';

    Invite.$inject = ["$scope", "$log", "CommonService", "CommonEvents", "SiteAlert", "MessagesRepo", "threadInfo"];
    angular
        .module('app.dashboard')
        .controller('Invite', Invite);

    /** @ngInject */
    function Invite($scope, $log,
                    CommonService, CommonEvents, SiteAlert,
                    MessagesRepo, threadInfo) {
        var vm = this;
        vm.errorMessage = null;
        vm.submitBusy = false;

        vm.thread = null;
        vm.sendInvite = sendInvite;
        vm.cancel = cancel;


        init();

        function init() {
            $log.debug('Invite init');
            vm.thread = threadInfo.thread;
            vm.members = threadInfo.members;

            CommonService.broadcast(CommonEvents.viewReady);
        }

        function sendInvite(model) {
            vm.submitBusy = true;
            vm.errorMessage = null;

            MessagesRepo.invite(vm.thread.id, model).then(
                function (data) {
                    vm.submitBusy = false;
                    SiteAlert.success("Your invite has been sent to " + model.email);
                    CommonService.previous();
                    vm.invite = null;
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });

        }

        function cancel() {
            CommonService.previous();
        }
    }

})();
/**
 *  Controller for the thread Leave.
 */
(function () {
    'use strict';

    Leave.$inject = ["$scope", "$log", "$state", "CommonService", "CommonEvents", "MessagesRepo", "threadInfo"];
    angular
        .module('app.dashboard.thread')
        .controller('Leave', Leave);

    /** @ngInject */
    function Leave($scope, $log, $state,
                   CommonService, CommonEvents,
                   MessagesRepo, threadInfo) {
        var vm = this;
        vm.errorMessage = null;
        vm.submitBusy = false;

        vm.thread = null;
        vm.leave = leave;
        vm.cancel = cancel;


        init();

        function init() {
            $log.debug('Leave init');
            vm.thread = threadInfo.thread;
            vm.members = threadInfo.members;

            CommonService.broadcast(CommonEvents.viewReady);
        }

        function leave() {
            vm.submitBusy = true;
            vm.errorMessage = null;

            MessagesRepo.leave(vm.thread.id).then(
                function (data) {
                    vm.submitBusy = false;
                    $state.go('dashboard.default');
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });

        }

        function cancel() {
            CommonService.previous();
        }
    }

})();
/**
 * Messages view controller.
 */
(function () {
    'use strict';

    Messages.$inject = ["$log", "$stateParams", "$state", "underscore", "CommonService", "CommonEvents", "AccountService", "MessagesService", "MessageFormatter", "threadInfo"];
    angular
        .module('app.dashboard')
        .controller('Messages', Messages);

    /** @ngInject */
    function Messages($log, $stateParams, $state, underscore, CommonService, CommonEvents,
                      AccountService, MessagesService, MessageFormatter, threadInfo) {
        var vm = this;
        vm.thread = null;
        vm.messages = null;
        vm.members = null;
        vm.message = '';
        vm.submitBusy = false;
        vm.errorMessage = null;

        vm.send = send;
        vm.onKeypress = onKeypress;
        vm.accountName = accountName;
        vm.isSameDay = isSameDay;
        vm.localTime = localTime;
        vm.body = body;

        init();

        function init() {
            $log.debug('messages init');

            vm.thread = threadInfo.thread;
            vm.members = threadInfo.members;

            $('textarea').on('keydown', function (e) {
                var value = $('textarea').val();
                var rows = $('textarea').attr('rows');
                console.log(rows)
                $('.textarea-copy').html(value);
                var textareaWidth = $('.textarea-copy').width();
                console.log(textareaWidth);
                if (textareaWidth < 1050) {
                    $('.reply').css({"height": "70px"})
                    $('textarea').attr('rows', '1');
                } else if (textareaWidth >= 1050 && textareaWidth < 2100) {
                    $('.reply').css({"height": "100px"})
                    $('textarea').attr('rows', '2');
                } else if (textareaWidth > 2100) {
                    $('.reply').css({"height": "130px"})
                    $('textarea').attr('rows', '3');
                }
            });

            var threadId = $stateParams.threadId;

            load(threadId);
        }

        function load(threadId) {
            MessagesService.getHistory(threadId).then(function (chats) {
                vm.messages = chats;
                CommonService.broadcast(CommonEvents.viewReady);
            });
        }

        function send(message) {
            vm.submitBusy = true;
            vm.errorMessage = null;

            var model = {
                message: message
            };

            var threadId = $stateParams.threadId;

            MessagesService.send($stateParams.threadId, model).then(
                function (data) {
                    vm.submitBusy = false;
                    vm.message = '';
                    vm.messages.push(data.threadchat);
                    $("html, body").animate({scrollTop: $(document).height()}, "slow");
                    console.log(vm.messages)
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                })


        }

        function onKeypress(event, message) {
            if (event.which === 13 && !event.shiftKey) {
                event.preventDefault();
                if (message.trim()) {
                    return vm.send(message);
                }
            }
        }

        /**
         * Returns whether two dates are the same day.
         * @returns {boolean}
         */
        function isSameDay(date1, date2) {
            return moment(date1).isSame(date2, 'day');
        }

        /**
         * Converts to local date/time from UTC.
         * @returns {Date}
         */
        function localTime(date) {
            return moment.utc(date).toDate();
        }

        /**
         * Renders the message body.
         *
         * @returns {String} HTML output.
         */
        function body(chat) {
            this.ML = this.ML || /\n/gm;
            var ml = this.ML;
            var text = chat.text;

            switch (chat.kind) {
                case 0:
                    text = underscore.escape(text);
                    text = MessageFormatter.run(text);
                    text = text.replace(ml, '<br/>');
                    break;
                case 2:
                    text = "joined " + vm.thread.name;
                    if (chat.inviter !== null) {
                        text += " by invitation from " + accountName(chat.inviter);
                    }
                    break;
                case 3:
                    if (chat.remover !== null) {
                        text = "was removed from " + vm.thread.name + " by " +
                            accountName(chat.remover)
                    }
                    else {
                        text = "left " + vm.thread.name;
                    }
                    break;
                case 4:
                    text = "archived " + vm.thread.name;
                    break;
                case 5:
                    text = "unarchived " + vm.thread.name;
                    break;
                case 6:
                    text = "updated thread " + vm.thread.name;
            }
            return text;
        }

        /**
         * Returns displayable account name.
         * @param accountId
         * @return {String}
         */
        function accountName(accountId) {
            var profile = vm.members[accountId].profile;
            return AccountService.accountName(profile);
        }
    }

})();
/**
 *  Controller for the thread pending invitations.
 */
(function () {
    'use strict';

    Pending.$inject = ["$scope", "$log", "$state", "CommonService", "CommonEvents", "MessagesRepo", "threadInfo"];
    angular
        .module('app.dashboard.thread')
        .controller('Pending', Pending);

    /** @ngInject */
    function Pending($scope, $log, $state,
                   CommonService, CommonEvents,
                   MessagesRepo, threadInfo) {
        var vm = this;
        vm.errorMessage = null;
        vm.submitBusy = false;

        vm.thread = null;
        vm.cancel = cancel;


        init();

        function init() {
            $log.debug('Pending init');
            vm.thread = threadInfo.thread;
            vm.members = threadInfo.members;

            CommonService.broadcast(CommonEvents.viewReady);
        }

        function cancel() {
            CommonService.previous();
        }
    }

})();
/**
 *  Controller for the thread Caregiver search.
 */
(function () {
    'use strict';

    Search.$inject = ["$scope", "$log", "$http", "CommonService", "CommonEvents", "MessagesRepo", "threadInfo"];
    angular
        .module('app.dashboard.thread')
        .controller('Search', Search);

    /** @ngInject */
    function Search($scope, $log, $http,
                  CommonService, CommonEvents,
                  MessagesRepo, threadInfo) {
        var vm = this;
        vm.errorMessage = null;
        vm.submitBusy = false;

        vm.thread = null;
        vm.search = search;
        vm.cancel = cancel;


        init();

        function init() {
            $log.debug('Invite init');
            vm.thread = threadInfo.thread;
            vm.members = threadInfo.members;

            CommonService.broadcast(CommonEvents.viewReady);
        }

        // Any function returning a promise object can be used to load values asynchronously
        $scope.getLocation = function (val) {
            return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: val,
                    sensor: false
                },
                dataType: 'jsonp'
            }).then(function (response) {
                return response.data.results.map(function (item) {
                    return item.formatted_address;
                });
            });
        };

        function search(model) {
            vm.submitBusy = true;
            vm.errorMessage = null;

            MessagesRepo.search(model).then(
                function (data) {
                    vm.submitBusy = false;
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });

        }

        function cancel() {
            CommonService.previous();
        }
    }

})();

/**
 * Controller for the sidepanel in the thread view.
 */
(function () {
    'use strict';

    Sidepanel.$inject = ["$log", "$state", "SidepanelState"];
    angular
        .module('app.dashboard')
        .controller('Sidepanel', Sidepanel);

    /** @ngInject */
    function Sidepanel($log, $state, SidepanelState) {
        var vm = this;

        init();

        function init() {
            $log.debug('sidepanel init');
            SidepanelState.setState($state.current.name);
            SidepanelState.open();
        }
    }

})();
/**
 * Parent controller for the `dashboard.messages` state.
 */
(function () {
    'use strict';

    Thread.$inject = ["$log", "$state", "$stateParams", "SidepanelState"];
    angular
        .module('app.dashboard')
        .controller('Thread', Thread);

    /** @ngInject */
    function Thread($log, $state, $stateParams, SidepanelState) {
        var vm = this;

        vm.sidepanel = SidepanelState;
        vm.toggleSidepanel = toggleSidepanel;
        vm.openSidepanel = openSidepanel;
        vm.closeSidepanel = closeSidepanel;

        init();

        function init() {
            $log.debug('thread init');

            if (SidepanelState.isOpen) {
                return openSidepanel();
            }
        }

        function toggleSidepanel() {
            return SidepanelState.isOpen ? closeSidepanel() : openSidepanel();
        }

        function openSidepanel() {
            var st = SidepanelState.state;
            return $state.go(st || 'dashboard.messages.default.sidepanel.default');
        }

        function closeSidepanel() {
            SidepanelState.close();
            return $state.go('dashboard.messages.default');
        }

    }

})();
/**
 *  Controller for the thread  info Update.
 */
(function () {
    'use strict';

    Update.$inject = ["$scope", "$log", "$state", "CommonService", "CommonEvents", "MessagesRepo", "threadInfo", "SiteAlert"];
    angular
        .module('app.dashboard.thread')
        .controller('Update', Update);

    /** @ngInject */
    function Update($scope, $log, $state,
                    CommonService, CommonEvents,
                    MessagesRepo, threadInfo, SiteAlert) {
        var vm = this;
        vm.errorMessage = null;
        vm.submitBusy = false;

        vm.thread = null;
        vm.type = true;
        vm.UpdateInfo = UpdateInfo;
        vm.cancel = cancel;
        vm.careServices = {Blue: true, Orange: true};

        init();

        function init() {
            console.log('UPDATE INIT2');
            vm.thread = threadInfo.thread;

            CommonService.broadcast(CommonEvents.viewReady);
        }

        function UpdateInfo(model) {

            vm.submitBusy = true;
            vm.errorMessage = null;

            //currently supporting Basic channel purpose only
            model = {
                name: vm.thread.name,
                purpose: vm.thread.purpose,
            };

            MessagesRepo.update(vm.thread.id, model).then(
                function (data) {
                    vm.submitBusy = false;
                    SiteAlert.success("Your update was successful.");
                    CommonService.previous();
                    SiteAlert.check();
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                }
            );

        }

        function cancel() {
            CommonService.previous();
        }
    }

})();
/**
 * Controller for the accept view.
 */
(function () {
    'use strict';

    Accept.$inject = ["$log", "$state", "$stateParams", "$location", "$anchorScroll", "AccountRepo", "CommonService", "CommonEvents"];
    angular
        .module('app.guest')
        .controller('Accept', Accept);

    /** @ngInject */
    function Accept($log, $state, $stateParams, $location, $anchorScroll,
                    AccountRepo, CommonService, CommonEvents) {
        var vm = this;

        var views = {
            default: 'default',
            invalid: 'invalid',
            used: 'used'
        };

        vm.messages = {
            signup: null,
            login: null
        };
        vm.spinners = {
            signup: false,
            login: false
        };
        vm.view = views.default;
        vm.invite = null;
        vm.signupModel = null;
        vm.loginModel = null;

        vm.signup = signup;
        vm.login = login;

        vm.gotoLogin = gotoLogin;

        init();

        function init() {
            console.log('Accept Init')
            console.log(angular.fromJson($stateParams.data))
            // Pre-fetched data can come as a URL parameter (`data`).

            var data = angular.fromJson($stateParams.data);

            // Delete `data` parameter from URL.
            // $state.go('.', {data: null}, {location: 'replace'});

            // Impossible token.
            if ($stateParams.token.length > 16) {
                return ready();
            }

            if (data) {
                return ready(data);
            }

            AccountRepo.invite($stateParams.token).then(ready, ready);

            function ready(invite) {
                CommonService.broadcast(CommonEvents.viewReady);
                vm.invite = invite;

                if (!vm.invite || (vm.invite && vm.invite.invalid)) {
                    vm.view = views.invalid;
                    return;
                }
                if (vm.invite.used) {
                    vm.view = views.used;
                    return;
                }
                vm.signupModel = {email: vm.invite.email};
                vm.loginModel = {email: vm.invite.email};
            }
        }

        function signup(model) {
            vm.spinners.signup = true;
            vm.messages.signup = null;
            AccountRepo.join(withToken(model)).then(
                function () {
                    return CommonService.hardRedirect('/app');
                },
                function (data) {
                    vm.spinners.signup = false;
                    vm.messages.signup = data;
                    $location.hash('signup-view');
                    $anchorScroll();
                }
            );
        }

        function login(model) {
            vm.spinners.login = true;
            vm.messages.login = null;
            AccountRepo.login(withToken(model)).then(
                function () {
                    return CommonService.hardRedirect('/app');
                },
                function (data) {
                    vm.spinners.login = false;
                    vm.messages.login = data;
                    gotoLogin();
                }
            );
        }

        function withToken(model) {
            return angular.extend(model, {token: vm.invite.token});
        }

        function gotoLogin() {
            $location.hash('login-view');
            $anchorScroll();
        }
    }

})();

/**
 * Base controller of the auth state.
 */
(function () {
    'use strict';

    Auth.$inject = ["CommonService", "CommonEvents"];
    angular
        .module('app.guest')
        .controller('Auth', Auth);

    /** @ngInject */
    function Auth(CommonService, CommonEvents) {
        var vm = this;
        vm.viewReady = false;

        init();

        function init() {
            CommonService.on('$stateChangeStart', function () {
                vm.viewReady = false;
            });
            CommonService.on(CommonEvents.viewReady, function () {
                vm.viewReady = true;
            });
        }
    }

})();
/**
 * Controller for the join view.
 */
(function () {
    'use strict';

    Join.$inject = ["$log", "$anchorScroll", "$state", "$stateParams", "AccountRepo", "CommonService", "CommonEvents", "SiteAlert"];
    angular
        .module('app.guest')
        .controller('Join', Join);

    /** @ngInject */
    function Join($log, $anchorScroll, $state, $stateParams,
                  AccountRepo, CommonService, CommonEvents, SiteAlert) {
        var vm = this;

        var defaultModel = {
            email: '',
            password: '',
            password_confirm: '',
            invite: '',
            org_name: '',
            org_username: ''
        };

        vm.errorMessage = null;
        vm.submitBusy = false;
        vm.signup = angular.copy(defaultModel);

        vm.cancel = cancel;
        vm.next = next;
        vm.previous = previous;
        vm.join = join;

        init();

        function init() {
            if ($stateParams.invite) {
                vm.signup.invite = $stateParams.invite;
            }
            CommonService.broadcast(CommonEvents.viewReady);
        }

        function join(model) {
            vm.submitBusy = true;
            vm.errorMessage = null;

            AccountRepo.join(model).then(
                function (data) {
                    CommonService.hardRedirect('/accounts#/edit');
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                    $anchorScroll('join-view');
                });
        }

        function cancel() {
            CommonService.previous();
        }

        /**
         * Go to next section of registration.
         */
        function next(model) {
            vm.submitBusy = true

            console.log(model)

            // TODO: maybe perform email verification (HTTP call) here.
            AccountRepo.check_availability(model.email).then(function(data){
                var account = data.data.response.account
                if (account === false) {
                    $state.go('auth.join.team')
                    vm.submitBusy = false
                } else {
                    SiteAlert.danger('Email is already in use')
                }
            })
        }

        /**
         * Go to previous section of registration.
         */
        function previous() {
            $state.go('auth.join.personal');
        }

    }

})();
/**
 * Controller for the login view.
 */
(function () {
    'use strict';

    Login.$inject = ["$log", "$anchorScroll", "$stateParams", "AccountRepo", "CommonService", "CommonEvents", "SiteAlert"];
    angular
        .module('app.guest')
        .controller('Login', Login);

    /** @ngInject */
    function Login($log, $anchorScroll, $stateParams,
                  AccountRepo, CommonService, CommonEvents, SiteAlert) {
        var vm = this;

        var next = null;
        var defaultAuth = {
            email: '',
            password: '',
        };

        vm.errorMessage = null;
        vm.submitBusy = false;
        vm.auth = angular.copy(defaultAuth);
        vm.login = login;

        init();

        function init() {
            CommonService.broadcast(CommonEvents.viewReady);
            next = $stateParams.next;
        }

        function login(model) {
            vm.submitBusy = true;
            vm.errorMessage = null;
            AccountRepo.login(model).then(
                function (data) {
                    CommonService.hardRedirect(next || '/app');
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                    $anchorScroll('login-view');
                });
        }
    }

})();
/**
 * Controller for the reset view.
 */
(function () {
    'use strict';

    Reset.$inject = ["$log", "$anchorScroll", "$stateParams", "AccountRepo", "CommonService", "CommonEvents", "SiteAlert"];
    angular
        .module('app.guest')
        .controller('Reset', Reset);

    /** @ngInject */
    function Reset($log, $anchorScroll, $stateParams,
                   AccountRepo, CommonService, CommonEvents, SiteAlert) {

        var vm = this;
        var next = null;

        vm.errorMessage = null;
        vm.submitBusy = false;
        vm.reset = reset;

        init();

        function init() {
            CommonService.broadcast(CommonEvents.viewReady);
        }

        function reset(model) {
            vm.submitBusy = true;
            vm.errorMessage = null;

            AccountRepo.resetPasswordEmail(model).then(
                function (data) {
                    vm.submitBusy = false;
                    SiteAlert.success("Your reset password email is on the way.");
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });

        }
    }

})();
/**
 * Created by timothybaney on 5/13/16.
 */

/**
 * Controller for the accept view.
 */
(function () {
    'use strict';

    Accept.$inject = ["$log", "$state", "$stateParams", "$location", "$anchorScroll", "AccountRepo", "CommonService", "CommonEvents"];
    angular
        .module('app.guest')
        .controller('ThreadAccept', Accept);

    /** @ngInject */
    function Accept($log, $state, $stateParams, $location, $anchorScroll,
                    AccountRepo, CommonService, CommonEvents) {
        var vm = this;

        var views = {
            default: 'default',
            invalid: 'invalid',
            used: 'used'
        };

        vm.messages = {
            signup: null,
            login: null
        };
        vm.spinners = {
            signup: false,
            login: false
        };
        vm.view = views.default;
        vm.invite = null;
        vm.signupModel = null;
        vm.loginModel = null;

        vm.signup = signup;
        vm.login = login;

        vm.gotoLogin = gotoLogin;

        init();

        function init() {
            console.log('ThreadAccept Init')
            console.log(angular.fromJson($stateParams.data))
            // Pre-fetched data can come as a URL parameter (`data`).

            var data = angular.fromJson($stateParams.data);

            // Delete `data` parameter from URL.
            // $state.go('.', {data: null}, {location: 'replace'});

            // Impossible token.
            if ($stateParams.token.length > 8) {
                return ready();
            }

            if (data) {
                return ready(data);
            }

            AccountRepo.threadInvite($stateParams.token).then(ready, ready);

            function ready(invite) {
                CommonService.broadcast(CommonEvents.viewReady);
                vm.invite = invite;

                if (!vm.invite || (vm.invite && vm.invite.invalid)) {
                    vm.view = views.invalid;
                    return;
                }
                if (vm.invite.used) {
                    vm.view = views.used;
                    return;
                }
                vm.signupModel = {email: vm.invite.email};
                vm.loginModel = {email: vm.invite.email};
            }
        }

        function signup(model) {
            vm.spinners.signup = true;
            vm.messages.signup = null;
            console.log(withToken(model))
            AccountRepo.join(withToken(model)).then(
                function (data) {
                    console.log(data)
                    return CommonService.hardRedirect('/accounts#/edit');
                },
                function (data) {
                    vm.spinners.signup = false;
                    vm.messages.signup = data;
                    $location.hash('signup-view');
                    $anchorScroll();
                }
            );
        }

        function login(model) {
            vm.spinners.login = true;
            vm.messages.login = null;
            AccountRepo.login(withToken(model)).then(
                function () {
                    return CommonService.hardRedirect('/app');
                },
                function (data) {
                    vm.spinners.login = false;
                    vm.messages.login = data;
                    gotoLogin();
                }
            );
        }

        function withToken(model) {
            return angular.extend(model, {invite: vm.invite.token});
        }

        function gotoLogin() {
            $location.hash('login-view');
            $anchorScroll();
        }
    }

})();
/**
 * Controller for the Verify view.
 */
(function () {
    'use strict';

    Verify.$inject = ["$log", "$anchorScroll", "$stateParams", "AccountRepo", "CommonService", "CommonEvents", "SiteAlert"];
    angular
        .module('app.guest')
        .controller('Verify', Verify);

    /** @ngInject */
    function Verify($log, $anchorScroll, $stateParams,
                    AccountRepo, CommonService, CommonEvents, SiteAlert) {

        var vm = this;
        var next = null;

        vm.errorMessage = null;
        vm.submitBusy = false;
        vm.verify = verify;

        init();

        function init() {
            CommonService.broadcast(CommonEvents.viewReady);
        }

        function verify(model) {
            vm.submitBusy = true;
            vm.errorMessage = null;

            AccountRepo.verifyEmail(model).then(
                function (data) {
                    vm.submitBusy = false;
                    SiteAlert.success("Your email was successfully verified.");
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });

        }
    }

})();
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Main landing page.
 */
(function () {
    Ctrl.$inject = ["$scope", "$http", "$location", "$anchorScroll"];
    angular
        .module('Home')
        .controller('LandingCtrl', Ctrl);

    /** @ngInject */
    function Ctrl($scope, $http, $location, $anchorScroll) {
        $scope.showInvite = true;
        $scope.invite = invite;
        $scope.gotoInvite = gotoInvite;
        $scope.contact = {
            interest: $location.absUrl().indexOf('/caregiver') >= 0 ? 1 : 2
        };

        function gotoInvite() {
            $location.path('/');
            $location.hash('invite');
            $anchorScroll();
        }

        function invite(contact) {
            if (!contact.name || !contact.email || !contact.zipcode || !contact.interest) {
                return;
            }
            $http.post('/submit_contact', contact)
                .success(function (data, status) {
                    $scope.showInvite = false;
                    gotoInvite();
                })
                .error(function () {
                    // Dang.
                });
        }
    }

})();
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * About Us controller
 */
angular
    .module('Home')
    .controller('aboutusCtrl', ['$scope', '$window', function ($scope, $window) {


    }]);

/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Caregiver controller
 */
angular
    .module('Home')
    .controller('caregiverCtrl', ['$scope', '$window', function ($scope, $window) {

        $scope.SignUp = function (){
            console.log("Hello");
            $window.location.href = '/home/join';
        };
    }]);
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Careseeker controller
 */
angular
    .module('Home')
    .controller('careseekerCtrl', ['$scope', '$window',
        function ($scope, $window) {

        $scope.SignUp = function () {
            $window.location.href = '/home/join';
        };

    }]);
/**
 * Created by ven on 9/28/16.
 */

'use strict';

/**
 * Base controller for the contact us module.
 */
angular
    .module('Home')
    .controller('contactCtrl', ['$scope', '$window', '$http',
        function ($scope, $window, $http) {

        }]);
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Base controller for the home module.
 */
angular
    .module('Home')
    .controller('faqCtrl', ['$scope', '$window', '$http',
        function ($scope, $window, $http) {

        }]);
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Base controller for the home module.
 */
angular
    .module('Home')
    .controller('homeBaseCtrl', ['$scope', '$window', '$http',
        function ($scope, $window, $http) {
            // bring in userSession if this controller ever gets used.
            $scope.SignUp = function () {
                $window.location.href = '/home/join';
            };

        }]);
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Interest controller
 */
(function () {
    Ctrl.$inject = ["$scope", "$http", "$location", "$anchorScroll"];
    angular
        .module('Home')
        .controller('interestCtrl', Ctrl);

    /** @ngInject */
    function Ctrl($scope, $http, $location, $anchorScroll) {
        $scope.showInvite = true;
        $scope.invite = invite;

        function invite(contact) {
            if (!contact.name || !contact.email || !contact.zipcode || !contact.interest) {
                return;
            }
            $http.post('/submit_contact', contact)
                .success(function (data, status) {
                    $scope.showInvite = false;
                })
                .error(function () {
                    // Dang.
                });
        }
    }

})();
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Press controller
 */
angular
    .module('Home')
    .controller('pressCtrl', ['$scope', '$window', function ($scope, $window) {


    }]);
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Preview provider profile controller
 */
angular
    .module('app.guest')
    .controller('previewProviderProfileCtrl', ['$scope', '$window', '$stateParams', '$http',
        function ($scope, $window, $stateParams, $http) {
            
            var provider_id = $stateParams.account_id;
            $scope.profile = {};
            $scope.usr = userSession;

            var init = function () {
                $http.get('/caregiver_profile?account_id=' + provider_id)
                    .then(function (response) {
                        $scope.profile = response.data;
                    });
            };
            init();

            $scope.connect = function () {
                if ($scope.usr.userdata !== null) {
                    var account_id = $scope.usr.userdata.account_id;
                    $http({
                        url: '/post_connection_request',
                        method: "POST",
                        params: {
                            from_id: account_id,
                            to_id: provider_id,
                            message: "I want to connect with you."
                        }
                    }).then(function (response) {
                        $scope.siteAlert.type = "success";
                        $scope.siteAlert.message = response.data.message;
                    }, function (response) {
                        $scope.siteAlert.type = "danger";
                        $scope.siteAlert.message = ("Oops. " + response.status + " Error. Please try again.");
                    });
                }
                else {
                    $scope.siteAlert.type = "danger";
                    $scope.siteAlert.message = ("Please Sign-In");
                }
            }
        }]);
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Press controller
 */
angular
    .module('app.guest')
    .controller('previewSeekerProfileCtrl', ['$scope', '$window', '$stateParams', '$http',
        function ($scope, $window, $stateParams, $http) {
            // bring in alternative to userSession
            var seeker_id = $stateParams.account_id;
            $scope.aboutMe = {};
            // $scope.usr = userSession;

            var init = function () {
                $http.get('/seeker_profile?account_id=' + seeker_id)
                    .then(function (response) {
                        $scope.aboutMe = response.data;
                    });
            };
            init();

            $scope.connect = function () {
                if ($scope.usr.userdata !== null) {
                    var account_id = $scope.usr.userdata.account_id;
                    $http({
                        url: '/post_connection_request',
                        method: "POST",
                        params: {
                            from_id: account_id,
                            to_id: seeker_id,
                            message: "I would like to connect with you."
                        }
                    }).then(function (response) {
                        $scope.siteAlert.type = "success";
                        $scope.siteAlert.message = response.data.message;
                    }, function (response) {
                        $scope.siteAlert.type = "danger";
                        $scope.siteAlert.message = ("Oops. " + response.status + " Error. Please try again.");
                    });
                }
                else {
                    $scope.siteAlert.type = "danger";
                    $scope.siteAlert.message = ("Please Sign-In");
                }
            }

        }]);
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Pricing controller
 */
angular
    .module('Home')
    .controller('pricingCtrl', ['$scope', '$window', function ($scope, $window) {


    }]);
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Privacy controller
 */
angular
    .module('Home')
    .controller('privacyCtrl', ['$scope', '$window', function ($scope, $window) {


    }]);
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Base controller for the home module.
 */
Search.$inject = ['$scope', '$http', 'SiteAlert', 'AccountRepo']
angular
    .module('app.guest')
    .controller('searchCtrl', Search)

    function Search ($scope, $http, SiteAlert, AccountRepo) {

        // find replacement for userSession

        $scope.searchModel = {};
        $scope.searchCaregiverResults = {};

        var init = function () {
            AccountRepo.get_caregivers()
                .then(function (response) {
                $scope.searchCaregiverResults = response.data;
                console.log($scope.searchCaregiverResults)

            }, function (response) {
                SiteAlert.danger("Oops. " + response.status + " Error. Please try again.")
            })

            AccountRepo.get_seekers()
                .then(function (response) {
                $scope.searchSeekerResults = response.data;
                console.log($scope.searchSeekerResults)

            }, function (response) {
                SiteAlert.danger("Oops. " + response.status + " Error. Please try again.")
            })

            $scope.auth.viewReady = true;

        };
        init();

        /**
         * Go back to the previous page/view.
         * @return void
         */
        $scope.previous = function () {
            $window.history.back();
        };

        $scope.find = function (model) {
            $http({
                url: '/search_caregivers',
                method: "GET",
                params: {search_string: model.search_string}
            }).then(function (response) {
                $scope.searchCaregiverResults = response.data;
            }, function (response) {
                SiteAlert.danger("Oops. " + response.status + " Error. Please try again.")
            });
        };

    };
'use strict';

/**
 * Terms controller
 */
angular
    .module('Home')
    .controller('termsCtrl', ['$scope', '$window', function ($scope, $window) {


    }]);
/**
 * Parent controller of the nearme module.
 */
(function () {
    'use strict';

    Base.$inject = ["CommonService", "CommonEvents"];
    angular
        .module('app.nearme')
        .controller('Base', Base);

    /* @ngInject */
    function Base(CommonService, CommonEvents) {
        var vm = this;
        vm.viewReady = false;

        init();

        function init() {
            CommonService.on('$stateChangeStart', function () {
                vm.viewReady = false;
            });
            CommonService.on(CommonEvents.viewReady, function () {
                vm.viewReady = true;
            });
        }
    }

})();
/**
 * Parent controller of the settings module.
 */
(function () {
    'use strict';

    Base.$inject = ["CommonService", "CommonEvents"];
    angular
        .module('app.settings')
        .controller('Base', Base);

    /* @ngInject */
    function Base(CommonService, CommonEvents) {
        var vm = this;
        vm.viewReady = false;

        init();

        function init() {
            CommonService.on('$stateChangeStart', function () {
                vm.viewReady = false;
            });
            CommonService.on(CommonEvents.viewReady, function () {
                vm.viewReady = true;
            });
        }
    }

})();
(function () {
    'use strict';

    Notifications.$inject = ["$scope", "SettingsRepo", "CommonService", "CommonEvents", "SiteAlert"];
    angular
        .module('app.settings')
        .controller('Notifications', Notifications);

    /** @ngInject */
    function Notifications($scope, SettingsRepo,
                           CommonService, CommonEvents, SiteAlert) {
        var vm = this;
        vm.settings = null;
        vm.updateSMSSettings = updateSMSSettings;
        vm.updateEmailSettings = updateEmailSettings;

        vm.errorMessageSMSSettings = null;
        vm.errorMessageEmailSettings = null;
        vm.submitBusy = {
            sms_spinner: false,
            email_spinner: false
        };

        init();
        function init() {
            console.log('Notifications Init')
            load();
        }

        function load() {
            SettingsRepo.getSettings().then(function (data) {
                CommonService.broadcast(CommonEvents.viewReady);
                vm.notifications = data.notifications;
            });
        }

        function updateSMSSettings(notifications) {
            vm.submitBusy.sms_spinner = true;
            SettingsRepo.updateNotifications(notifications).then(
                function (data) {
                    vm.submitBusy.sms_spinner = false;
                    SiteAlert.success("SMS Settings were updated successfully.");
                },
                function (data) {
                    vm.submitBusy.sms_spinner = false;
                    vm.errorMessageSMSSettings = data;
                });
        }

        function updateEmailSettings(notifications) {
            vm.submitBusy.email_spinner = true;
            SettingsRepo.updateNotifications(notifications).then(
                function (data) {
                    vm.submitBusy.email_spinner = false;
                    SiteAlert.success("Email Settings were updated successfully.");
                },
                function (data) {
                    vm.submitBusy.email_spinner = false;
                    vm.errorMessageEmailSettings = data;
                });
        }

    }

})();
(function () {
    'use strict';

    Payments.$inject = ["$scope", "SettingsRepo", "CommonService", "CommonEvents"];
    angular
        .module('app.settings')
        .controller('Payments', Payments);

    /* @ngInject */
    function Payments($scope, SettingsRepo,
                      CommonService, CommonEvents) {
        var vm = this;
        vm.settings = null;
        vm.deletePayment = deletePayment;
        vm.addPayment = addPayment;

        vm.saveIsDisabled = false;

        init();
        function init() {
            console.log('Payments Init')
            load();
        }

        function load() {
            SettingsRepo.getSettings().then(function (data) {
                CommonService.broadcast(CommonEvents.viewReady);
                vm.payment = data.payment;
            });
        }

        function deletePayment() {
            SettingsRepo.deletePayment().then(function (data) {
                CommonService.broadcast(CommonEvents.viewReady);
                vm.payment = "";
            });
        }

        function addPayment(paymentMethod) {
            vm.saveIsDisabled = true;
            SettingsRepo.addPayment(paymentMethod).then(function (data) {
                vm.payment = data.payment;
                vm.saveIsDisabled = false;
            });
        }

    }

})();
(function () {
    'use strict';

    Security.$inject = ["$scope", "SettingsRepo", "CommonService", "CommonEvents", "SiteAlert"];
    angular
        .module('app.settings')
        .controller('Security', Security);

    /* @ngInject */
    function Security($scope, SettingsRepo,
                      CommonService, CommonEvents, SiteAlert) {
        var vm = this;
        vm.settings = null;
        vm.changePassword = changePassword;
        vm.closeAccount = closeAccount;
        vm.password = {};

        vm.errorMessagePasswordChange = null;
        vm.errorMessageAccountClose = null;
        vm.submitBusy = false;

        vm.reasons = [
            {"value": 0, "name": "Duplicate", "description": "I have a duplicate account"},
            {"value": 1, "name": "Dontneed", "description": "I don't need the services anymore."},
            {"value": 2, "name": "Different", "description": "I am using a different professional service."},
            {"value": 3, "name": "Other", "description": "Other Reasons"}
        ];

        init();
        function init() {
            load();
        }

        function load() {
            SettingsRepo.getSettings().then(function (data) {
                CommonService.broadcast(CommonEvents.viewReady);
            });
        }

        function changePassword(oldpwd, newpwd) {
            vm.submitBusy = true;
            vm.errorMessagePasswordChange = null;
            var model = {oldvalue: oldpwd, newValue: newpwd};

            SettingsRepo.changePassword(model).then(
                function (data) {
                    vm.submitBusy = false;
                    SiteAlert.success("Your password has been changed.");
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessagePasswordChange = data;
                });
        }

        function closeAccount(reason) {
            if (window.confirm("Do you really want to close your account?")) {
                vm.submitBusy = true;
                vm.errorMessageAccountClose = null;
                SettingsRepo.closeAccount(reason).then(
                    function (data) {
                        SiteAlert.success("Your account is now closed.");
                        CommonService.hardRedirect('/logout');
                    },
                    function (data) {
                        vm.submitBusy = false;
                        vm.errorMessageAccountClose = data;
                    });
            }
        }

    }

})();
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Notifications controller
 */
angular
    .module('app.settings')
    .controller('notificationsCtrl', ['$scope', '$http', 'userSession',
        function ($scope, $http, userSession) {

            $scope.notificationModel = {};
            $scope.errorModel = {};
            $scope.usr = userSession;
            var account_id = $scope.usr.userdata.account_id;

            var init = function () {
                $http.get('/get_settings_notifications?account_id=' + account_id)
                    .then(function (response) {
                        $scope.notificationModel = response.data;
                    }, function (response) {
                        $scope.siteAlert.type = "danger";
                        $scope.siteAlert.message = ("Oops. " + response.status + " Error. Please try again.");
                    });
            };
            init();

            $scope.updateNotifications = function (model) {
                //add the usr object
                model = angular.extend(model, {'account_id': account_id});
                $http.post('/post_settings_notifications', model)
                    .success(function (data, status) {
                        $scope.siteAlert.type = "success";
                        $scope.siteAlert.message = "Your settings were updated successfully.";
                    })
                    .error(function () {
                        $scope.siteAlert.type = "danger";
                        $scope.siteAlert.message = "Oops. There was a problem. Please try again.";
                    });
            };

        }]);
'use strict';

/**
 * Payments controller
 */
angular
    .module('app.settings')
    .controller('paymentsCtrl', ['$scope', '$http', 'userSession',
        function ($scope, $http, userSession) {

            $scope.paymentModel = {};
            $scope.usr = userSession;
            var account_id = $scope.usr.userdata.account_id;

            var init = function () {
                $http.get('/get_settings_payments?account_id=' + account_id)
                    .success(function (response) {
                        $scope.paymentModel = response;
                    })
                    .error(function () {
                        $scope.siteAlert.type = "danger";
                        $scope.siteAlert.message = ("Oops. " + response.status + " Error. Please try again.");
                    });
            };
            init();

            $scope.updatePayments = function (model) {
                model = angular.extend(model, {'account_id': account_id});
                $http.post('/post_settings_payments', model)
                    .success(function (data, status) {
                        $scope.siteAlert.type = "success";
                        $scope.siteAlert.message = "Your settings were updated successfully.";
                    })
                    .error(function () {
                        $scope.siteAlert.type = "danger";
                        $scope.siteAlert.message = "Oops. There was a problem. Please try again.";
                    });
            };

        }]);
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Security controller
 */
angular
    .module('app.settings')
    .controller('securityCtrl', ['$scope', '$http', 'userSession',
        function ($scope, $http, userSession) {

            $scope.paymentModel = {};
            $scope.usr = userSession;
            var account_email = $scope.usr.userdata.email;

            var validate = function (model) {
                if (!model.password || !model.password_confirm) {
                    $scope.siteAlert.type = "danger";
                    $scope.siteAlert.message = "All fields are required.";
                }
                if (model.password !== model.password_confirm) {
                    $scope.siteAlert.type = "danger";
                    $scope.siteAlert.message = "Password does not match the confirmation.";
                }
                return true;
            };

            $scope.updatePassword = function (model) {
                if (!validate(model)) {
                    return false;
                }
                model = angular.extend(model, {'email': account_email});
                $http.post('/post_settings_security', model)
                    .success(function (data, status) {
                        $scope.siteAlert.type = "success";
                        $scope.siteAlert.message = "Your password was updated successfully.";
                    })
                    .error(function () {
                        $scope.siteAlert.type = "danger";
                        $scope.siteAlert.message = "Oops. There was a problem. Please try again.";
                    });
            };


        }]);
/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Base controller for the settings module.
 */
angular
    .module('app.settings')
    .controller('settingsBaseCtrl', ['$scope', '$window', function ($scope, $window) {

        // CtrlHelper that is shared between the parent and all children.
        $scope.ctrlHelper = new HL.CtrlHelper();

        /**
         * Go back to the previous page/view.
         * @return void
         */
        $scope.previous = function () {
            $window.history.back();
        };

    }]);
/**
 * Factory that manages the state of the thread sidepanel.
 */
(function () {
    'use strict';

    angular
        .module('app.dashboard.thread')
        .factory('SidepanelState', SidepanelState);

    /** ngInject */
    function SidepanelState() {

        var sidepanel = {
            isOpen: false,
            state: '',
            close: close,
            open: open,
            setState: setState
        };

        return sidepanel;

        function open() {
            sidepanel.isOpen = true;
        }

        function close() {
            sidepanel.isOpen = false;
        }

        function setState(stateName) {
            sidepanel.state = stateName;
        }

    }

})();