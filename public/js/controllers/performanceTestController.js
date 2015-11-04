app.controller("performanceTestController",function($scope, ssnocService, $q,$rootScope){
    $scope.messages = [];
    $scope.announcements = [];
    
    var testMessage = "20characters message";
    var position = {lat:'0', lng:'0'};
    var delay = 500;
    var fakeUser = 999;
    var defer = $q.defer();
    var countCalls = 0;

    // window.location = "/#/perfomance";

    $scope.performTest = function(){

      var startTime = new Date().getTime();

      while(new Date().getTime() < startTime + delay){
        testSendMessage();
        testGetMessage();
        countCalls++;
      }

      console.log("Perfomance: " + countCalls + " " + (new Date().getTime() - startTime));
    }

    function testSendMessage(){
      // $rootScope.currentPosition.lat
        // + " " + $rootScope.currentPosition.lng;
      console.log("Test send message");
      ssnocService.testSendMessage(testMessage, position, fakeUser);
    }
     
    function testGetMessage(){
        console.log("Test getting message");
        ssnocService.testGetMessage()
        .success(function(response)
        {
          $scope.messages = response;

          // $scope.messages.forEach(function(entry) {
            //console.log("Position:" + entry.position);
          // });
        });
    }
});