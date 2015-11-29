app.factory('shakeService',function() {
	var shake = {
        
	    //Shake detection
	    addShakeDetection : function() {
	      if (typeof window.DeviceMotionEvent != 'undefined') {
	          var moveLimit = 20;
	          var x1 = 0, y1 = 0, z1 = 0;
	          var x2 = 0, y2 = 0, z2 = 0;

	          window.addEventListener('devicemotion', function (e) {
	              x1 = e.accelerationIncludingGravity.x;
	              y1 = e.accelerationIncludingGravity.y;
	              z1 = e.accelerationIncludingGravity.z;
	          }, true);

	          checkMovement = function()
	          {
	              var lastMove = Math.abs(x1-x2+y1-y2+z1-z2);

	              if (lastMove > moveLimit) {
	                  window.location = "/#/emergencymode";
	              }

	              x2 = x1;
	              y2 = y1;
	              z2 = z1;            
	          };
	          
	          setInterval(checkMovement, 150);
	      }
	    }
	};

	return shake;
});
