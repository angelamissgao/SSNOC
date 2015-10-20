app.controller("chatController",function($scope, ssnocService, $q,$rootScope){
    $scope.directory = {};
    $scope.directoryDict = {};
    $scope.loading = true;
    $scope.messages = [];
    $scope.announcements = [];
    $scope.chatMessage = "";

    $scope.statuses = [
      {name:"OK", id:1},
      {name:"Help", id:2},
      {name:"Emergency", id:3}
    ]


    var defer = $q.defer();

    
    getDirectory();
    getAllMessages();

    $scope.logout = function()
    {
      ssnocService.updateStatus($rootScope.id, 0).
      success(function(response){
          console.log("logout" + response);
          window.location = "/";
      });
    }

    $scope.shareStatus= function(status_id){
      //1-ok 2-help 3-emergency 0-logout
      ssnocService.updateStatus($rootScope.id, status_id);
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

    function getDirectory()
    { 
      $scope.loading = true;
      ssnocService.getDirectory()
        .success(function(data) {
        $scope.directory = data;
        for (var i = 0; i < $scope.directory.length; i ++) {
          var member = $scope.directory[i];
          $scope.directoryDict[member._id] = member;
          console.log("here is the "+member.name + (member.status)+(member.lastLogin));
        }
        $scope.loading = false;

      }); 
    }

    $scope.newPrivateChat = function(memberId)
    {
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

    $rootScope.socket.on('userStatusChange', function(){
      console.log("updating directory")
        getDirectory();
    });
    
    // socket.on('disconnect', function(){
    //   //update status send no
    //   console.log("disconnecting" + $rootScope.id);
    //   ssnocService.updateStatus($rootScope.id, 0);
   
    // });

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

//Navigation controller
    $scope.announcements=false;
    $scope.namelists=false;
    $scope.chatpublic=true;
    $scope.inbox=false;
    $scope.showstatus = false;

    $scope.postAnnoucements= function(){
       $scope.announcements=true;
       $scope.namelists=false;
       $scope.chatpublic=false;
       $scope.inbox=false;
       getAnnouncements();
       // $scope.showstatus = false;
    }

    $scope.showNamelists = function(){
      $scope.namelists=true;
      $scope.announcements=false;
      $scope.chatpublic=false;
      $scope.inbox=false;
      // $scope.showstatus = false;
    }

    $scope.chatPublicly = function (){
      $scope.chatpublic=true;
      $scope.announcements=false;
      $scope.namelists=false;
      $scope.inbox=false;
      // $scope.showstatus = false;
    }

    $scope.showInbox = function (){
      $scope.inbox=true;
      $scope.announcements=false;
      $scope.namelists=false;
      $scope.chatpublic=false;
      // $scope.showstatus = false;
    }

  // $scope.showStatus = function(){
  //     $scope.showstatus = true;
  //     $scope.inbox=false;
  //     $scope.announcements=false;
  //     $scope.namelists=false;
  //     $scope.chatpublic=false;
  // }    

});