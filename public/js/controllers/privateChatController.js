
app.controller("privateChatController",function($scope, ssnocService, $q,$rootScope){
	$scope.messages ={};

	$scope.sendMessage = function(){
      
      console.log("sendMessage");
      console.log($rootScope.id);
      ssnocService.addPrivateMessage($scope.chatMessage, $rootScope.id, $rootScope.receiverId);
    }


});