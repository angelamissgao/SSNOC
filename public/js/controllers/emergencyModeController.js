app.controller("emergencyModeController",function($scope, ssnocService, $q,$rootScope){
	$scope.messages = [];
	$scope.announcements = [];
	var intervalTime = 60000;
	var alertInterval = [];

	startEmergencyMode(intervalTime);

	function startEmergencyMode(interval){
      //alert('Shake!');
      ssnocService.updateStatus($rootScope.member.id, $rootScope.currentPosition, 3);
      ssnocService.addEmergency("Emergency, please help!", $rootScope.currentPosition, $rootScope.member.id);
      $rootScope.member.status = 3;
      console.log("test"+$rootScope.member.id);

      alertInterval = setInterval(function(){
            	ssnocService.addEmergency("Emergency, please help!", $rootScope.currentPosition, $rootScope.member.id);
            },interval); 
  }

  $scope.stopEmergencyMode = function(){
  	clearInterval(alertInterval);
  	window.location = "/#/chatting";
  };

  $rootScope.socket.on('stop_emergency', function(){
    console.log("Stop!");
    clearInterval(alertInterval);
    window.location = "/#/chatting";
  });


});