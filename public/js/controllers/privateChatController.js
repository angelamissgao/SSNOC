
app.controller("privateChatController",function($scope, ssnocService, $q,$rootScope){
	$scope.messages ={};

   var socket = io.connect();  

	getPrivateMessage();

   socket.on('privatemessage', function(result){
    console.log(privatemessage);
    if(result.member_id = $rootScope.id && result.receiver_id == $rootScope.receiverId)
    {
      $scope.messages.push(result.message);
     $scope.$apply();
    }
     
   });

	$scope.sendMessage = function(){
      
      console.log("sendMessage");
      console.log($rootScope.id);
      ssnocService.addPrivateMessage($scope.chatMessage, $rootScope.id, $rootScope.receiverId);
      $scope.chatMessage = "";
    }

   function getPrivateMessage(){
   		ssnocService.getPrivateMessage($rootScope.id, $rootScope.receiverId)
   		.success(function(data){
            console.log('getPrivateMessage: ' + $scope.messages);
   			$scope.messages = data;
   		});
   }
});