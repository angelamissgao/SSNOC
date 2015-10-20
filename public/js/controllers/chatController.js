app.controller("chatController",function($scope, ssnocService, $q,$rootScope){
    $scope.directory = {};
    $scope.directoryDict = {};
    $scope.loading = true;
    $scope.messages = [];
    $scope.announcements = [];
    $scope.chatMessage = "";


    var defer = $q.defer();

    getDirectory();
    getAllMessages();
    getAnnouncements();

    $scope.logout = function()
    {
      ssnocService.updateStatus($rootScope.id, 0).
      success(function(response){
          console.log("logout" + response);
          $rootScope.authenticated = false;
          window.location = "/";
      });
    }

    $scope.isOnline = function(status)
    {
        if(status != 0)
        {
          return true;
        }
        else
        {
          return false;
        }
    }

    $scope.isAnnoucement = function(receiverId)
    {
      if(receiverId == 1)
      {
        return true;
      }
      else
      {
        return false;
      }
    }

     $scope.shareStatus= function(status_id){
      //1-ok 2-help 3-emergency 0-logout

      console.log("update status in core" + status_id);
      ssnocService.updateStatus($rootScope.id, status_id);
    }

    function getDirectory()
    { 
      $scope.loading = true;
      ssnocService.getDirectory()
        .success(function(data) {
        $scope.directory = data;
        for (var i = 0; i < $scope.directory.length; i ++) {
          var member = $scope.directory[i];
          $scope.directoryDict[member._id] = member;
        }
        $scope.loading = false;

      }); 
    }

    $scope.newPrivateChat = function(memberId){
      $rootScope.receiverId = memberId;
      window.location="/#/privatechat";
    }

    $scope.sendMessage = function(){
      console.log("sendMessage");
      console.log($rootScope.id);
      ssnocService.addPublicMessage($scope.chatMessage, $rootScope.id);
    }

    $scope.postAnnouncement = function(){
      console.log("postAnnoucement");
      console.log($rootScope.id);
      ssnocService.addAnnouncement($scope.chatMessage, $rootScope.id)
      .success(function(response){
          getAnnouncements();
      });
    }

    $rootScope.socket.on('message', function(msg){
        $scope.messages.push(msg);
        $scope.chatMessage = "";
        $scope.$apply();

      });

    $scope.msgAlert=false;

    $rootScope.socket.on('privatemessage', function(result){
       $scope.msgAlert=true; 
      $scope.$apply();
    });

    $rootScope.socket.on('userStatusChange', function(){
      console.log("updating directory")
        getDirectory();
    });
    
    $rootScope.socket.on('disconnect', function(){
      //update status send no
      console.log("disconnecting" + $rootScope.id);
      ssnocService.updateStatus($rootScope.id, 0);
    });

    $( window ).unload(function() {
       ssnocService.updateStatus($rootScope.id, 0);
    });
     
    function getAllMessages(){
        console.log("getting messages");
        ssnocService.getPublicMessages()
        .success(function(response)
        {
          $scope.messages = response;
        });
    }

    function getAnnouncements(){
        console.log("getting messages");
        ssnocService.getAnnouncements()
        .success(function(response)
        {
          console.log(response);
          $scope.announcements = response;
        });
    } 

});