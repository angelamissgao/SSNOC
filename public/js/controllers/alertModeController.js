app.controller("alertModeController",function($scope, ssnocService, $q,$rootScope){
	$scope.messages = [];
	$scope.announcements = [];
	var intervalTime = 60000;
	var alertInterval = [];

	startAlertMode(intervalTime);

	function startAlertMode(interval){
      //alert('Shake!');
      ssnocService.addEmergency("Emergency, please help!", $rootScope.currentPosition, $rootScope.member.id);

      alertInterval = setInterval(function(){
      	ssnocService.addEmergency("Emergency, please help!", $rootScope.currentPosition, $rootScope.member.id);
      },interval); 
  	}

  $scope.stopAlertMode = function(){
  	clearInterval(alertInterval);
  	window.location = "/#/chatting";
  };

  $rootScope.socket.on('stop_emergency', function(){
    console.log("Stop!");
    clearInterval(alertInterval);
    window.location = "/#/chatting";
  });


});