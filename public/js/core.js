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

            .when('/privatechat', {
                templateUrl : 'privatechat.html',
                controller  : 'privateChatController'
            })

            // // route for the contact page
            // .when('/contact', {
            //     templateUrl : 'pages/contact.html',
            //     controller  : 'contactController'
            // });
    }]);

app.run(function($rootScope){

    $rootScope.id;    
    $rootScope.receiverId;
    $rootScope.socket = io.connect(); 
    $rootScope.currentPosition=[];    

});