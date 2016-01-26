var communityApp =angular.module('CommunityApp', ['ui.router']);

communityApp.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});

communityApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('index', {
            url: '/',
            views: {
                '': {
                    templateUrl: 'tpls/login.html'
                }
            }
        })
});