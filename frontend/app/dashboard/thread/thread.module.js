/**
 * Thread module.
 */
(function () {
    'use strict';

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
                    title: function (threadInfo) {
                        return threadInfo.thread.name;
                    }
                },
                views: {
                    '': {
                        templateUrl: '/views/dashboard/partials/thread/main.html',
                        controller: 'Thread',
                        controllerAs: 'thread'
                    },
                    'header@dashboard.messages': {
                        templateUrl: '/views/dashboard/partials/thread/header.html',
                        controller: function (threadInfo) {
                            this.thread = threadInfo.thread;
                        },
                        controllerAs: 'vm'
                    }
                }
            })
            .state('dashboard.messages.default', {
                url: '/',
                templateUrl: '/views/dashboard/partials/thread/messages.html',
                controller: 'Messages',
                controllerAs: 'vm',
                resolve: {
                    threadInfo: threadInfoResolve,
                },
            })
            .state('dashboard.messages.invite', {
                url: '/invite',
                templateUrl: '/views/dashboard/partials/thread/invite.html',
                controller: 'Invite',
                controllerAs: 'vm'
            })
            .state('dashboard.messages.update', {
                url: '/update',
                templateUrl: '/views/dashboard/partials/thread/update.html',
                controller: 'Update',
                controllerAs: 'vm'
            })
            .state('dashboard.messages.leave', {
                url: '/leave',
                templateUrl: '/views/dashboard/partials/thread/leave.html',
                controller: 'Leave',
                controllerAs: 'vm'
            })
            .state('dashboard.messages.archive', {
                url: '/archive',
                templateUrl: '/views/dashboard/partials/thread/archive.html',
                controller: 'Archive',
                controllerAs: 'vm'
            })
            .state('dashboard.messages.search', {
                url: '/search',
                templateUrl: '/views/dashboard/partials/thread/search.html',
                controller: 'Search',
                controllerAs: 'vm'
            })
            .state('dashboard.messages.default.sidepanel', {
                abstract: true,
                templateUrl: '/views/dashboard/partials/thread/sidepanel.html',
                controller: 'Sidepanel',
                controllerAs: 'sp'
            })
            .state('dashboard.messages.default.sidepanel.default', {
                url: 'info',
                templateUrl: '/views/dashboard/partials/thread/info.html',
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

            var thread = underscore.find(threads, function (th) {
                return th.owner.id === ownerId && th.name.toLowerCase() === threadName;
            });
            return populate(thread);
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
