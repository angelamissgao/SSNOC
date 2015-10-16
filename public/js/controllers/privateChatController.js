
app.controller("privateChatController",function($scope, ssnocService, $q,$rootScope){
	$scope.messages ={};

	getPrivateMessage();

	$scope.sendMessage = function(){
      
      console.log("sendMessage");
      console.log($rootScope.id);
      ssnocService.addPrivateMessage($scope.chatMessage, $rootScope.id, $rootScope.receiverId);
    }

   function getPrivateMessage(){
   		ssnocService.getPrivateMessage($rootScope.id, $rootScope.receiverId)
   		.success(function(data){
   			$scope.messages = data;
   		});
   }
});