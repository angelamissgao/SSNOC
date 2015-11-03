
app.controller("privateChatController",function($scope, ssnocService, $q,$rootScope){
	$scope.messages ={};
  $scope.msgAlert=false;
  $scope.member = {};
  $scope.receiver = {};
  $scope.searchPrivateMessage = "";
  $scope.searchAlert = false;

  getUsers();
	getPrivateMessages();

  $rootScope.socket.on('privatemessage', function(result){

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
      ssnocService.addPrivateMessage($scope.chatMessage, $rootScope.currentPosition, $rootScope.id, $rootScope.receiverId);
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


 $scope.searchPrivateMessages = function(){
  var stopwords = ["a","able","about","across","after","all","almost","also","am","among","an","and","any","are","as","at","be","because","been","but","by","can","cannot","could","dear","did","do","does","either","else","ever","every","for","from","get","got","had","has","have","he","her","hers","him","his","how","however","i","if","in","into","is","it","its","just","least","let","like","likely","may","me","might","most","must","my","neither","no","nor","not","of","off","often","on","only","or","other","our","own","rather","said","say","says","she","should","since","so","some","than","that","the","their","them","then","there","these","they","this","tis","to","too","twas","us","wants","was","we","were","what","when","where","which","while","who","whom","why","will","with","would","yet","you","your"];
    if (stopwords.indexOf($scope.searchPrivateMessage) == -1 ) {
      ssnocService.searchPrivateMessages($scope.searchPrivateMessage,$rootScope.id, $rootScope.receiverId)
      .success(function(response){
        if(response.length == 0){
            $scope.searchAlert = true;
            $scope.messages = null;
        }
        else{
          $scope.searchAlert = false;
          $scope.messages = response;
        }
      });
    }
    else {
      $scope.searchAlert = true;
      $scope.messages = null;
    }
}


});