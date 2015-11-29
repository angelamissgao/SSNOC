app.controller("chatController",function($scope, ssnocService, $q,$rootScope){
  $scope.directory = {};
  $scope.directoryDict = {};
  $scope.loading = true;
  $scope.messages = [];
  $scope.announcements = [];
  $scope.emergencies = [];
  $scope.chatMessage = "";
  $scope.searchMessage = "";
  $scope.searchAlert = false;
  $rootScope.currentMsgPage = 0;

  var defer = $q.defer();

  $scope.statusMap = {
    "ok":1,
    "help":2,
    "emergency":3,
    "undefined":0
  };

  getDirectory();
  getAllMessages();
  getAnnouncements();
  getEmergencies();

  $scope.isOnline = function(status)
  {
    if(status !== 0)
    {
      return true;
    }
    else
    {
      return false;
    }
  };

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
  };

  $scope.isEmergency = function(receiverId)
  {
    if(receiverId == 999)
    {
      return true;
    }
    else
    {
      return false;
    }
  };

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
  };

  $scope.sendMessage = function(){
    ssnocService.addPublicMessage($scope.chatMessage, $rootScope.currentPosition, $rootScope.member.id);
  };

  $scope.postAnnouncement = function(){
    ssnocService.addAnnouncement($scope.chatMessage, $rootScope.currentPosition, $rootScope.member.id)
    .success(function(response){
      getAnnouncements();
    });
  };
  
  $scope.stopAlertMode = function(){
    console.log("Stop button!");
    ssnocService.stopEmergency();
  };

  $rootScope.socket.on('message', function(msg){
    $scope.messages.push(msg);
    $scope.chatMessage = "";
    $scope.$apply();
  });

  $rootScope.socket.on('emergency', function(msg){
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
    getDirectory();
  });


  $(window).unload(function() {
   ssnocService.updateStatus($rootScope.member.id, $rootScope.currentPosition, 0);
 });

  function getAllMessages(){
    console.log("getting messages");
    ssnocService.getPublicMessages()
    .success(function(response)
    {
      $scope.messages = response;
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

  function getEmergencies(){
    ssnocService.getEmergencies()
    .success(function(response)
    {
      console.log(response);
      $scope.emergencies = response;
    });
  }

    //search functions 
    var stopwords = ["a","able","about","across","after","all","almost","also","am","among","an","and","any","are","as","at","be","because","been","but","by","can","cannot","could","dear","did","do","does","either","else","ever","every","for","from","get","got","had","has","have","he","her","hers","him","his","how","however","i","if","in","into","is","it","its","just","least","let","like","likely","may","me","might","most","must","my","neither","no","nor","not","of","off","often","on","only","or","other","our","own","rather","said","say","says","she","should","since","so","some","than","that","the","their","them","then","there","these","they","this","tis","to","too","twas","us","wants","was","we","were","what","when","where","which","while","who","whom","why","will","with","would","yet","you","your"];

    $scope.searchMessages = function(){
      $rootScope.currentMsgPage = 0;
      if (stopwords.indexOf($scope.searchMessage) == -1 ) {
        ssnocService.searchPublicMessages($scope.searchMessage)
        .success(function(response){
          if(response.length === 0){
            $scope.searchAlert = true;
            $scope.messages = [];
          }
          else{
            $scope.searchAlert = false;
            $scope.messages = response;
          }
        });
      }
      else {
        $scope.searchAlert = true;
        $scope.messages = [];
      } 
    };


    $scope.searchAnnouncements = function(){
     $rootScope.currentMsgPage = 0;
     if (stopwords.indexOf($scope.searchAnnouncement) == -1 ) {
      ssnocService.searchAnnouncements($scope.searchAnnouncement)
      .success(function(response){
        if(response.length === 0){
          $scope.searchAlert = true;
          $scope.announcements = [];
        }
        else{
          $scope.announcements = response;
          $scope.searchAlert = false;
        } 
      });
    }
    else {
      $scope.searchAlert = true;
      $scope.announcements = [];
    } 
  };

  $scope.searchMemberNames = function(){
    ssnocService.searchMemberNames($scope.searchMemberName)
    .success(function(response){
      if(response.length === 0){
        $scope.searchAlert = true;
        $scope.directory = [];
      }
      else{
        $scope.searchAlert = false;
        $scope.directory = response;
        for (var i = 0; i < $scope.directory.length; i ++) {
          var member = $scope.directory[i];
          $scope.directoryDict[member._id] = member;
        }
      }
    });
  };

  $scope.searchMemberStatus = function(){
    var search_status = $scope.searchByStatus.toLowerCase();
    if (search_status in $scope.statusMap)
    {
      ssnocService.searchMemberStatus($scope.statusMap[search_status])
      .success(function(response){
        if(response.length === 0){
          $scope.searchAlert = true;
          $scope.directory = [];
        }
        else{
          $scope.directory = response;
          for (var i = 0; i < $scope.directory.length; i ++) {
            var member = $scope.directory[i];
            $scope.directoryDict[member._id] = member;
          }
        }
      });
    }
  };

});
