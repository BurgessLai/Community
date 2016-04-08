var communityApp = angular.module('CommunityApp', ['ui.router', 'ngResource']);

communityApp.run(function($rootScope, $state, $stateParams, $http) {
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
    $rootScope.isManager = false;
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.signOut = function() {
        $rootScope.authenticated = false;
        $rootScope.current_user = '';
        $rootScope.isManager = false;
        $http.get('auth/signout');
    };
});

communityApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        //home page
        .state('main', {
            url: '/',
            views: {
                '': {
                    templateUrl: 'tpls/main.html',
                },
                'startList@main': {
                    templateUrl: 'tpls/startList.html',
                    controller: 'startCtrl'
                }
            }
        })
        .state('login', {
            url: '/logIn',
            templateUrl: 'tpls/login.html',
            controller: 'authCtrl'
        })
        .state('signup', {
            url: '/signUp',
            templateUrl: 'tpls/signup.html',
            controller: 'authCtrl'
        })
        //use to manage community's articles by manager
        .state('manaArticle', {
            url: '/manaArticle',
            templateUrl: 'tpls/manaArticle.html',
            controller: 'manaArticleCtrl'
        })
        //use to manage community's people by manager
        .state('manaMember', {
            url: '/manaMember',
            templateUrl: 'tpls/manaMember.html',
            controller: 'manaMemberCtrl'
        })
        .state('pubArticle', {
            url: '/pubArticle',
            templateUrl: 'tpls/pubArticle.html',
            controller: 'pubArticleCtrl'
        })
        .state('editArticle', {
            url: '/edit',
            params: { article: null },
            templateUrl: 'tpls/editArticle.html',
            controller: 'editArticleCtrl'
        })
        .state('showArticle', {
            url: '/showArticle',
            params: { article: null },
            templateUrl: 'tpls/articleInDetail.html',
            controller: 'articleInDetailCtrl'
        })
        .state('showMyArticles', {
            url: '/showMyArticles',
            templateUrl: 'tpls/myArticles.html',
            controller: 'myArticlesCtrl'
        })
        .state('showUser', {
            url: '/showUser',
            params: { username: null },
            templateUrl: 'tpls/userIndetail.html',
            controller: 'userIndetailCtrl'
        });
});

communityApp.controller('manaMemberCtrl', function($scope, $resource, $state) {
    var usersService = $resource('/userAPI/user/:typeOfsearch/:skip');
    var typeOfsearch = 'all';
    $scope.currentPage = 1;
    //get users's data and initialize paging's parameters
    $scope.users = usersService.query({ typeOfsearch: typeOfsearch, skip: 0 }, function() {
        $scope.totalItems = $scope.users.length;
        $scope.numberOfPages = Math.ceil($scope.totalItems / 10);
        $scope.pageList = [];
        for (var i = 1; i < $scope.numberOfPages + 1; i++) {
            $scope.pageList.push(i);
        }
    });
    //the three methods used for paging
    $scope.prevPage = function() {
        $scope.currentPage = $scope.currentPage - 1;
        var skip = ($scope.currentPage - 1) * 10;
        $scope.users = usersService.query({ typeOfsearch: typeOfsearch, skip: skip });
    };
    $scope.changeCurrentPage = function(item) {
        $scope.currentPage = item;
        var skip = ($scope.currentPage - 1) * 10;
        $scope.users = usersService.query({ typeOfsearch: typeOfsearch, skip: skip });
    };
    $scope.nextPage = function() {
        $scope.currentPage = $scope.currentPage + 1;
        var skip = ($scope.currentPage - 1) * 10;
        $scope.users = usersService.query({ typeOfsearch: typeOfsearch, skip: skip });
    };

    var isBanService = $resource('/userAPI/user/:_id/:powerToLogin', 
        {_id: '@_id', powerToLogin: '@powerToLogin'},
        { 'patch': 
                {
                    method: 'PATCH',
                }
        }
    );
    //whether to ban user's power 
    $scope.isBan = function(id,isban){
        isBanService.patch({ _id: id, powerToLogin: !isban }, function(){
            var typeOfsearch = 'all';
            $scope.currentPage = 1;
            $scope.users = usersService.query({ typeOfsearch: typeOfsearch, skip: 0 }, function() {
            $scope.totalItems = $scope.users.length;
            $scope.numberOfPages = Math.ceil($scope.totalItems / 10);
            $scope.pageList = [];
            for (var i = 1; i < $scope.numberOfPages + 1; i++) {
                $scope.pageList.push(i);
            }
    });
        });
    };                       
});
communityApp.controller('editArticleCtrl', function($scope, $stateParams, $resource, $state) {
    console.log($stateParams.article);
    $scope.article = $stateParams.article;
    $scope.saveMsg = '';
    var editArtService = $resource('/articleAPI/article/editArticle');
    $scope.saveArticle = function(){
        editArtService.save($scope.article, function(){
            $state.go('showMyArticles');   
        })
    }                     
});
communityApp.controller('userIndetailCtrl', function($scope, $stateParams, $rootScope, $resource, $location) {
    var user = $resource('/userAPI/user/userMsg/:who',{who: $stateParams.username});
    $scope.user = user.get();
    $scope.current_user = $rootScope.current_user;
    $scope.isChangePassword = false;
    $scope.newPassword = '';
    $scope.isChangePassword = function(){
        $scope.isChangePassword = true;
    }
    $scope.changePassword = function(){
        var changePWService = $resource('/userAPI/user/password');
        var user = {
            username: $rootScope.current_user,
            newPassword: $scope.newPassword
        };
        changePWService.save(user, function(){
            $location.path('/');    
        })
    }             
});

communityApp.controller('manaArticleCtrl', function($scope, $rootScope, ArticleService, $resource) {
    //use to articlePaging
    var typeOfsearch = 'all';
    $scope.currentPage = 1;
    $scope.articles = ArticleService.query({ typeOfsearch: typeOfsearch, skip: 0 }, function() {
        $scope.totalItems = $scope.articles.length;
        $scope.numberOfPages = Math.ceil($scope.totalItems / 10);
        $scope.pageList = [];
        for (var i = 1; i < $scope.numberOfPages + 1; i++) {
            $scope.pageList.push(i);
        }
    });

    $scope.prevPage = function() {
        $scope.currentPage = $scope.currentPage - 1;
        var skip = ($scope.currentPage - 1) * 10;
        $scope.articles = ArticleService.query({ typeOfsearch: typeOfsearch, skip: skip });
    };
    $scope.changeCurrentPage = function(item) {
        $scope.currentPage = item;
        var skip = ($scope.currentPage - 1) * 10;
        $scope.articles = ArticleService.query({ typeOfsearch: typeOfsearch, skip: skip });
    };
    $scope.nextPage = function() {
        $scope.currentPage = $scope.currentPage + 1;
        var skip = ($scope.currentPage - 1) * 10;
        $scope.articles = ArticleService.query({ typeOfsearch: typeOfsearch, skip: skip });
    };

    //deal with personal article
    var singleArtService = $resource('/articleAPI/article/delete');
    $scope.delete = function(id){
        var articleID = { _id: id };
        singleArtService.delete(articleID, function(){
            $scope.currentPage = 1;
            $scope.articles = ArticleService.query({ typeOfsearch: typeOfsearch, skip: 0 }, function() {
                $scope.totalItems = $scope.articles.length;
                $scope.numberOfPages = Math.ceil($scope.totalItems / 10);
                $scope.pageList = [];
                for (var i = 1; i < $scope.numberOfPages + 1; i++) {
                    $scope.pageList.push(i);
                }
            });
        });
    }
});



communityApp.controller('myArticlesCtrl', function($scope, $rootScope, ArticleService, $resource) {
    //use to articlePaging
    var typeOfsearch = $rootScope.current_user;
    $scope.currentPage = 1;
    $scope.articles = ArticleService.query({ typeOfsearch: typeOfsearch, skip: 0 }, function() {
        $scope.totalItems = $scope.articles.length;
        $scope.numberOfPages = Math.ceil($scope.totalItems / 10);
        $scope.pageList = [];
        for (var i = 1; i < $scope.numberOfPages + 1; i++) {
            $scope.pageList.push(i);
        }
    });

    $scope.prevPage = function() {
        $scope.currentPage = $scope.currentPage - 1;
        var skip = ($scope.currentPage - 1) * 10;
        $scope.articles = ArticleService.query({ typeOfsearch: typeOfsearch, skip: skip });
    };
    $scope.changeCurrentPage = function(item) {
        $scope.currentPage = item;
        var skip = ($scope.currentPage - 1) * 10;
        $scope.articles = ArticleService.query({ typeOfsearch: typeOfsearch, skip: skip });
    };
    $scope.nextPage = function() {
        $scope.currentPage = $scope.currentPage + 1;
        var skip = ($scope.currentPage - 1) * 10;
        $scope.articles = ArticleService.query({ typeOfsearch: typeOfsearch, skip: skip });
    };

    //deal with personal article
    var singleArtService = $resource('/articleAPI/article/delete');
    $scope.delete = function(id){
        var articleID = { _id: id };
        singleArtService.delete(articleID, function(){
            $scope.currentPage = 1;
            $scope.articles = ArticleService.query({ typeOfsearch: typeOfsearch, skip: 0 }, function() {
                $scope.totalItems = $scope.articles.length;
                $scope.numberOfPages = Math.ceil($scope.totalItems / 10);
                $scope.pageList = [];
                for (var i = 1; i < $scope.numberOfPages + 1; i++) {
                    $scope.pageList.push(i);
                }
            });
        });
    }
});

communityApp.controller('pubArticleCtrl', function($scope, $location, $rootScope, $resource) {
    var pubArticle = $resource('/articleAPI/article/saveArticle');
    $scope.article = { author: '', content: '', title: '', argreeNum: 0, created_at: '' };

    $scope.saveArticle = function() {
        $scope.article.author = $rootScope.current_user;
        $scope.article.created_at = Date.now();
        pubArticle.save($scope.article, function() {
            $location.path('/');
        })
    }
});

communityApp.controller('startCtrl', function($scope, $resource) {
    var starts = $resource('/userAPI/user/start');
    $scope.starts = starts.query();
});

communityApp.controller('articleInDetailCtrl', function($scope, $state, $stateParams, $rootScope, $resource) {
    $scope.article = $stateParams.article;

    var exchangesService = $resource('/articleAPI/article/exchanges');
    $scope.newComment = {
        articleID: $scope.article._id,
        commentMsg: '',
        commenter: $rootScope.current_user
    };
    $scope.comment =function(){
        exchangesService.save($scope.newComment, function() {
            $scope.newComment.commentMsg = '';
            $scope.article = exchangesService.get($scope.newComment, function() {
                   
            });      
        });           
    };


    var agree = $resource('/articleAPI/article/agree/:agreeMsg');
    var agreeMsg = {
        articleID: $scope.article._id,
        assentor:  $rootScope.current_user
    };
    $scope.agree = function(){
        agree.save(agreeMsg, function(data) {
            $scope.agreeResultMsg = data.message;
        })
    };

    var concernMsg={
        articleAuthor: $stateParams.article.author,
        Follower:  $rootScope.current_user
    };
    var concern = $resource('/userAPI/user/concern');
    $scope.concern = function(){
        concern.save(concernMsg, function(data) {
            $scope.agreeResultMsg = data.message;
        })
    };
});


//use to query article for directive of articlePaging 
communityApp.factory('ArticleService', function($resource) {
    return $resource('/articleAPI/article/:typeOfsearch/:skip');
});

//according to two-away data binding to finish this articlePaging
communityApp.directive('articlePaging', function() {
    return {
        restrict: 'E',
        templateUrl: 'tpls/articlePaging.html',
        controller: function($scope, ArticleService) {
            //typeOfsearch is 'all' or 'quality', default 'all' 
            var typeOfsearch = 'all';
            $scope.currentPage = 1;
            $scope.articles = ArticleService.query({ typeOfsearch: typeOfsearch, skip: 0 }, function() {
                $scope.totalItems = $scope.articles.length;
                $scope.numberOfPages = Math.ceil($scope.totalItems / 10);
                //button of number on the bottom
                $scope.pageList = [];
                for (var i = 1; i < $scope.numberOfPages + 1; i++) {
                    $scope.pageList.push(i);
                }
            });

            $scope.prevPage = function() {
                $scope.currentPage = $scope.currentPage - 1;
                var skip = ($scope.currentPage - 1) * 10;
                $scope.articles = ArticleService.query({ typeOfsearch: typeOfsearch, skip: skip });
            };
            $scope.changeCurrentPage = function(item) {
                $scope.currentPage = item;
                var skip = ($scope.currentPage - 1) * 10;
                $scope.articles = ArticleService.query({ typeOfsearch: typeOfsearch, skip: skip });
            };
            $scope.nextPage = function() {
                $scope.currentPage = $scope.currentPage + 1;
                var skip = ($scope.currentPage - 1) * 10;
                $scope.articles = ArticleService.query({ typeOfsearch: typeOfsearch, skip: skip });
            };
            $scope.showQuality = function() {
                typeOfsearch = 'quality';
                $scope.articles = ArticleService.query({ typeOfsearch: typeOfsearch, skip: 0 }, function() {
                    $scope.totalItems = $scope.articles.length;
                    $scope.numberOfPages = Math.ceil($scope.totalItems / 10);
                    $scope.pageList = [];
                    for (var i = 1; i < $scope.numberOfPages + 1; i++) {
                        $scope.pageList.push(i);
                    }
                });
            };

            $scope.showAll = function() {
                typeOfsearch = 'all';
                $scope.articles = ArticleService.query({ typeOfsearch: typeOfsearch, skip: 0 }, function() {
                    $scope.totalItems = $scope.articles.length;
                    $scope.numberOfPages = Math.ceil($scope.totalItems / 10);
                    $scope.pageList = [];
                    for (var i = 1; i < $scope.numberOfPages + 1; i++) {
                        $scope.pageList.push(i);
                    }
                });
            };

        }
    };
});


communityApp.controller('authCtrl', function($scope, $http, $rootScope, $location) {
    $scope.user = { username: '', password: '' };
    $scope.error_message = '';

    //login and signup all post to authenticate.js 
    $scope.login = function() {
        $http.post('/auth/login', $scope.user).success(function(data) {
            if (data.state == 'success') {
                if(data.user.position == "Manager"){
                    $rootScope.isManager = true;
                }
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;
                $location.path('/');
            } else {
                $scope.error_message = data.message;
            }
        });
    };

    $scope.signup = function() {
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