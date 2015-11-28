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

            .when('/performance', {
              templateUrl : 'performance.html',
              controller  : 'performanceTestController'
            });

          }]);

app.run(function($rootScope, ssnocService, member){
    $rootScope.socket = io.connect(); 

    // $rootScope.currentPosition = {lat: 0, lng: 0};
    // $rootScope.currentPosition.lat = 0;    
    // $rootScope.currentPosition.lng = 0;    
    // $rootScope.authenticated = false;
    $rootScope.member = new member();

    $rootScope.statuses = {
    'Offline' : {'name':"Offline", 'id': 0},
    'OK' : {'name':"OK", 'id':1},
    'Help' :{ 'name' :"Help", 'id':2},
    'Emergency' :{'name':"Emergency", 'id':3}
    };

    $rootScope.statusImgMap = {
      0:"offline.png",
      1:"ok-icon.png",
      2:"help-icon.png",
      3:"emergency-icon.png",
    };$

    $rootScope.currentMsgPage = 0;
    var pageSize = 10;
    
    getLocation();

    function getLocation(){
      navigator.geolocation.getCurrentPosition(showLocation);
    }

    function showLocation(position) {
      console.log("core::showLocation: %s", position);
      if(position!==undefined) {

        $rootScope.member.position = {lat: position.coords.latitude, lng: position.coords.longitude};
      }
    }

    $rootScope.shareStatus= function(status_id){
     $rootScope.memberstatus = status_id;
     ssnocService.updateStatus($rootScope.member.id, $rootScope.position, status_id);
    };

    $rootScope.logout = function()
    {
      ssnocService.updateStatus($rootScope.member.id, $rootScope.member.position, $rootScope.statuses.Offline.id).
      success(function(response){
        console.log("logout" + response);
        $rootScope.member.setAuthentication(false);
        window.location = "/";
      });
    };

    $rootScope.socket.on('disconnect', function(){
      console.log("disconnecting" + $rootScope.member.id);
      ssnocService.updateStatus($rootScope.member.id, $rootScope.statuses.Offline.id);
      $rootScope.$apply();
    });

    $rootScope.isSearchMsgShown = function(messageId, messages)
    {
      for (var i = 0; i < messages.length; i ++) {
        if (messages[i]._id == messageId) {
          if (i < ($rootScope.currentMsgPage+1) * pageSize) {
            return true;
          }
          else {
            return false;
          }
        }
      }
      return false;
    };

    $rootScope.isShowMoreButtonShown = function(messages) {
      if (($rootScope.currentMsgPage+1) * pageSize >= messages.length) {
        return false;
      }
      else {
        return true;
      }
    };

    $rootScope.showMore = function() {
      $rootScope.currentMsgPage += 1;
    };

  });


