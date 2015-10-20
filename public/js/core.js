var app = angular.module('ssnoc',['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
        // $rootscope ="hello world",
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'login.html',
                controller  : 'mainController'
            })

            // // route for the about page
            .when('/chatting', {
                templateUrl : 'chat.html',
                controller  : 'chatController'
            })
    
            .when('/directory',{
                templateUrl: 'directory.html',
                controller:'chatController'
            })

            .when('/inbox', {
                templateUrl : 'inbox.html',
                controller  : 'chatController'
            })

            .when('/announcements', {
                templateUrl : 'announcement.html',
                controller  : 'chatController'
            })

            .when('/privatechat', {
                templateUrl : 'privatechat.html',
                controller  : 'privateChatController'
            })

    }]);

app.run(function($rootScope){

    $rootScope.id;    
    $rootScope.receiverId;
    $rootScope.socket = io.connect();  

});