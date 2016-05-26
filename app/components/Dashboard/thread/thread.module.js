/**
 * Thread module.
 */
(function () {
    'use strict';

    Config.$inject = ["$stateProvider"];
    threadInfoResolve.$inject = ["ready", "$stateParams", "$q", "underscore", "MessagesService"];
    angular
        .module('app.dashboard.thread', [
            'ngSanitize'
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
                views: {
                    'messages@dashboard.messages': {
                        templateUrl: '/static/templates/dashboard/partials/thread/messages.html',
                        controller: 'Messages',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    threadInfo: threadInfoResolve,
                }
            })
            .state('dashboard.messages.invite', {
                url: '/invite',
                views: {
                    'messages@dashboard.messages': {
                        templateUrl: '/static/templates/dashboard/partials/thread/invite.html',
                        controller: 'Invite',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    threadInfo: threadInfoResolve,
                }
            })
            .state('dashboard.messages.update', {
                url: '/update',
                views: {
                    'messages@dashboard.messages': {
                        templateUrl: '/static/templates/dashboard/partials/thread/update.html',
                        controller: 'Update',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    threadInfo: threadInfoResolve,
                }
            })
            .state('dashboard.messages.leave', {
                url: '/leave',
                views: {
                    '@dashboard.messages': {
                        templateUrl: '/static/templates/dashboard/partials/thread/leave.html',
                        controller: 'Leave',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('dashboard.messages.archive', {
                url: '/archive',
                views: {
                    '@dashboard.messages': {
                        templateUrl: '/static/templates/dashboard/partials/thread/archive.html',
                        controller: 'Archive',
                        controllerAs: 'vm'
                    }
                }
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
                views: {
                    '@dashboard.messages': {
                        templateUrl: '/static/templates/dashboard/partials/thread/info.html',
                        controller: 'Info',
                        controllerAs: 'vm'
                    }
                }
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

            function thread(threads) {
                var threadsList = threads[0]
                for (var thread in threadsList) {
                    if (threadsList[thread].owner.id === ownerId && threadsList[thread].name.toLowerCase() === threadName) {
                        return threadsList[thread]
                    }
                }
            }

            var threadResult = thread(threads)
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