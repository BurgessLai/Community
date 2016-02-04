var communityApp =angular.module('CommunityApp', ['ui.router']);

communityApp.run(function($rootScope, $state, $stateParams) {
  $rootScope.authenticated = false;
  $rootScope.current_user = '';
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;

  $rootScope.signout = function(){
      $rootScope.authenticated = false;
      $rootScope.current_user = '';
      $http.get('auth/signout');
  };
});

communityApp.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('login', {
        url: '/login',
        templateUrl: 'tpls/login.html',
        controller: 'authController'
    })
    .state('signup', {
        url: '/signup',
        templateUrl: 'tpls/signup.html',
        controller: 'authController'
    })
});

communityApp.controller('authController', function($scope, $http, $rootScope, $location){
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';

  $scope.login = function(){
    $http.post('/auth/login', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };

  $scope.register = function(){
    $http.post('/auth/signup', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };
});