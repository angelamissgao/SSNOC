
app.controller("privateChatController",function($scope, ssnocService, $q,$rootScope){
	$scope.messages ={};

   var socket = io.connect();  

	getPrivateMessage();

   socket.on('message', function(msg){
     $scope.messages.push(msg);
     $scope.$apply();
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