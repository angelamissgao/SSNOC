app.controller("performanceTestController",function($scope, ssnocService, $q,$rootScope){
    $scope.messages = [];
    $scope.announcements = [];
    
    var testMessage = "20characters message";
    var position = {lat:'0', lng:'0'};
    $scope.delay = 500;
    var fakeUser = 999;
    var defer = $q.defer();
    $scope.countCalls = 0;

    // window.location = "/#/perfomance";

    $scope.performTest = function(){

     var startTime = new Date().getTime();

     console.log("delay " + $scope.delay);

      runPerformance(startTime, function(result){
        console.log("Perfomance: " + result + " " + (new Date().getTime() - startTime));  
        
             console.log("Reset database!!!!!");
          ssnocService.testReset();
       });

 
    }

    function runPerformance(startTime, callback)
    {
     var interval =  setInterval(function(){
          testSendMessage();
          console.log("1");
          
          testGetMessage();
          console.log("2");
          $scope.countCalls++;
          if(new Date().getTime() > startTime + $scope.delay){
             clearInterval(interval);
             console.log("3  delay" + $scope.delay);
             callback($scope.countCalls);
           }
           console.log("4");
        },100); 
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