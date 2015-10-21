
app.controller("privateChatController",function($scope, ssnocService, $q,$rootScope){
	$scope.messages ={};
  $scope.msgAlert=false;
  $scope.member = {};
  $scope.receiver = {};

  getUsers();
	getPrivateMessages();

   $rootScope.socket.on('privatemessage', function(result){
    console.log("private msg from controller" + result);

      if((result.member_id == $rootScope.id && result.receiver_id == $rootScope.receiverId)
          ||(result.receiver_id == $rootScope.id && result.member_id == $rootScope.receiverId))
      {
        $scope.messages.push(result);
        $scope.msgAlert=true;
        $scope.$apply();
      }
     
   });

   $scope.getName = function(memberId){
      if(memberId == $scope.member._id)
      {
        return $scope.member.name;
      }
      return $scope.receiver.name;
   }

	$scope.sendMessage = function(){
      console.log("sendMessage");
      console.log($rootScope.id);
      ssnocService.addPrivateMessage($scope.chatMessage, $rootScope.id, $rootScope.receiverId);
      $scope.chatMessage = "";
    }

   function getPrivateMessages(){
   		ssnocService.getPrivateMessage($rootScope.id, $rootScope.receiverId)
   		.success(function(data){
            console.log('getPrivateMessage: ' + $scope.messages);
   			$scope.messages = data;
   		});
   }

   function getUsers(){
      ssnocService.getMemberById($rootScope.id).success(function(response){
        console.log("pc mem  " + response.name);
          $scope.member = response;
      });
      ssnocService.getMemberById($rootScope.receiverId).success(function(response){
         console.log("pc rec  " + response.name);
          $scope.receiver = response;
      });

   }


});