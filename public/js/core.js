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

app.run(function($rootScope, ssnocService){

    $rootScope.id;    
    $rootScope.receiverId;
    $rootScope.socket = io.connect(); 
    $rootScope.currentPosition = {lat: 0, lng: 0};
    $rootScope.currentPosition.lat = 0;    
    $rootScope.currentPosition.lng = 0;    
    $rootScope.authenticated = false;
    $rootScope.statuses = [
      {name:"OK", id:1},
      {name:"Help", id:2},
      {name:"Emergency", id:3}
    ];
    
    getLocation();

    function getLocation(){
      navigator.geolocation.getCurrentPosition(showLocation);
    }

    function showLocation(position) {
      console.log("core::showLocation: %s", $rootScope.currentPosition);
      if(position!==undefined) {
        $rootScope.currentPosition = position;
      }
    }

     $rootScope.shareStatus= function(status_id){
     //1-ok 2-help 3-emergency 0-logout

      console.log("update status in core" + status_id);
      // ssnocService.updateStatus($rootScope.id, $rootScope.currentPosition, status_id);
      ssnocService.updateStatus($rootScope.id, status_id);
    }

    $rootScope.logout = function()
    {
      ssnocService.updateStatus($rootScope.id, $rootScope.currentPosition, 0).
      success(function(response){
          console.log("logout" + response);
          $rootScope.authenticated = false;
          window.location = "/";
      });
    }

    $rootScope.socket.on('disconnect', function(){
      console.log("disconnecting" + $rootScope.id);
      ssnocService.updateStatus($rootScope.id, 0);
      $scope.$apply();
    });

});

