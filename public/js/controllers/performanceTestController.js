app.controller("performanceTestController",function($scope, ssnocService, $q,$rootScope){
    $scope.messages = [];
    $scope.announcements = [];
    
    var testMessage = "20characters_message";
    var position = {lat:'0', lng:'0'};
    $scope.delay = 500;
    var fakeUser = 2;
    var defer = $q.defer();
    $scope.countCalls = 0;
    $scope.countPuts = 0;
    $scope.countGets = 0;
    $scope.resultTime = 0;
    var getMode = true;
    var stopCount = false;

    $scope.performTest = function(){

     var startTime = new Date().getTime();
     $scope.countCalls = 0;
     $scope.countPuts = 0;
     $scope.countGets = 0;
     $scope.resultTime = 0;
     $scope.throughputs = 0;

     console.log("delay " + $scope.delay);

     ssnocService.lockApplication();

      runPerformance(startTime, function(result){
        $scope.resultTime = new Date().getTime() - startTime;
        
        $scope.throughputs = (($scope.countGets + $scope.countPuts) / $scope.resultTime)*1000;
        $scope.throughputs = ($scope.throughputs.toFixed(1)); 
            
        console.log("Perfomance: " + result + " " + $scope.resultTime);  

        console.log("count performance: " + $scope.countCalls + " get " + $scope.countGets + 
          " put " + $scope.countPuts + " tp " + $scope.throughputs);
    
          console.log("Reset database!!!!!");
          ssnocService.testReset();
       });

    };

    function runPerformance(startTime, callback)
    {
     var interval =  setInterval(function(){
          if(getMode)
          {
            testSendMessage();          
          }
          else {
            testGetMessage();            
          }

          getMode = !getMode;

          $scope.countCalls++;
          if(new Date().getTime() > startTime + $scope.delay){
             clearInterval(interval);
             stopCount = true;
             callback($scope.countCalls);
           }
        },10); 
    }


    function testSendMessage(){
      newMessage = testMessage + $scope.countCalls;
      ssnocService.testSendMessage(newMessage, position, fakeUser)
      .success(function()
        {
          if(stopCount === false){
            $scope.countPuts++;
          }
        });
    }
     
    function testGetMessage(){
        ssnocService.testGetMessage()
        .success(function()
        {
          if(stopCount === false){
            $scope.countGets++;
          }
        });
    }
});
