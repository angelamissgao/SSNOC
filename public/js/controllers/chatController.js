app.controller("chatController",function($scope, ssnocService, $q,$rootScope){
    $scope.directory = {};
    $scope.directoryDict = {};
    $scope.loading = true;
    $scope.messages = [];
    $scope.announcements = [];
    $scope.chatMessage = "";
    $scope.searchMessage = "";
    // $scope.searchResult = [];
    $scope.statusImgMap = {
      0:"undefined.png",
      1:"ok.png",
      2:"help.png",
      3:"emergency.png",
    };


    var defer = $q.defer();

    getDirectory();
    getAllMessages();
    getAnnouncements();

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
      console.log("Send message location: " + $rootScope.currentPosition.lat
        + " " + $rootScope.currentPosition.lng);
      console.log("sendMessage");
      console.log($rootScope.id);
      ssnocService.addPublicMessage($scope.chatMessage, $rootScope.currentPosition, $rootScope.id);
    }

    $scope.postAnnouncement = function(){
      console.log("postAnnoucement");
      console.log($rootScope.id);
      ssnocService.addAnnouncement($scope.chatMessage, $rootScope.currentPosition, $rootScope.id)
      .success(function(response){
          getAnnouncements();
      });
    }


    $rootScope.socket.on('message', function(msg){
        $scope.messages.push(msg);
        console.log("msg %p",  msg);
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
    

    $( window ).unload(function() {
       ssnocService.updateStatus($rootScope.id, $rootScope.currentPosition, 0);
    });
     
    function getAllMessages(){
        console.log("getting messages");
        ssnocService.getPublicMessages()
        .success(function(response)
        {
          $scope.messages = response;
          // console.log("msg %p",  response);
          $scope.messages.forEach(function(entry) {
            console.log("Position:" + entry.position);
          });

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

    $scope.searchMessages = function(){
      ssnocService.searchPublicMessages($scope.searchMessage)
      .success(function(response){
        // $scope.searchResult = response;
        $scope.messages = response;
      });
    }


   $scope.searchAnnouncements = function(){
    ssnocService.searchAnnouncements($scope.searchAnnouncement)
    .success(function(response){
      // $scope.searchResult = response;
      $scope.announcements = response;
    });
  }

  $scope.searchMemberNames = function(){
    ssnocService.searchMemberNames($scope.searchMemberName)
    .success(function(response){
      // $scope.searchResult = response;
      $scope.directory = response;
        for (var i = 0; i < $scope.directory.length; i ++) {
          var member = $scope.directory[i];
          $scope.directoryDict[member._id] = member;
        }
    });
  }


});