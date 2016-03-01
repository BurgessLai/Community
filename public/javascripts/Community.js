var communityApp = angular.module('CommunityApp', ['ui.router', 'ngResource']);

communityApp.run(function($rootScope, $state, $stateParams) {
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.signout = function() {
        $rootScope.authenticated = false;
        $rootScope.current_user = '';
        $http.get('auth/signout');
    };
});

communityApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('main', {
            url: '/',
            views: {
                '': {
                    templateUrl: 'tpls/main.html',
                },
                'articleList@main': {
                    templateUrl: 'tpls/articleList.html',
                    controller: 'articleListCtrl'
                },
                'startList@main': {
                    templateUrl: 'tpls/startList.html',
                    controller: 'startCtrl' 
                }
            }
        })
        .state('login', {
            url: '/login',
            templateUrl: 'tpls/login.html',
            controller: 'authCtrl'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'tpls/signup.html',
            controller: 'authCtrl'
        })
        .state('pubArticle', {
            url: '/pubArticle',
            templateUrl: 'tpls/pubArticle.html',
            controller: 'pubArticleCtrl'
        });

});


communityApp.factory('pubArticleService', function($resource) {
    return $resource('/articleCRUD/article/saveArticle');
});

communityApp.controller('pubArticleCtrl', function(pubArticleService, $scope, $http, $rootScope){
    $scope.article = {author:'', content:'', title:'', argreeNum:0, created_at:''};

    $scope.saveArticle = function(){
        $scope.article.author = $rootScope.current_user;
        $scope.article.created_at = Date.now();
        pubArticleService.save($scope.article, function(){
            
        })  
    }
});

communityApp.controller('authCtrl', function($scope, $http, $rootScope, $location) {
    $scope.user = { username: '', password: '' };
    $scope.error_message = '';

    $scope.login = function() {
        $http.post('/auth/login', $scope.user).success(function(data) {
            if (data.state == 'success') {
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;
                $location.path('/');
            } else {
                $scope.error_message = data.message;
            }
        });
    };

    $scope.register = function() {
        $http.post('/auth/signup', $scope.user).success(function(data) {
            if (data.state == 'success') {
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;
                $location.path('/');
            } else {
                $scope.error_message = data.message;
            }
        });
    };
});


communityApp.factory('articleService', function($resource) {
    return $resource('/articleCRUD/article/quality');
});
communityApp.controller('articleListCtrl', function(articleService, $scope) {
    $scope.articles = articleService.query();   
});

communityApp.factory('startService', function($resource) {
    return $resource('/userCRUD/user/start');
});
communityApp.controller('startCtrl', function(startService, $scope) {
    $scope.starts = startService.query();   
});