app.factory('locationService',function($rootScope) {
	var location = {
        
	    //Shake detection
	    getLocation : function() {
	    	navigator.geolocation.getCurrentPosition(this.setLocation);
	    },
	    setLocation : function(position) {
	      if(position!==undefined) {
	        $rootScope.member.position = {lat: position.coords.latitude, lng: position.coords.longitude};
	      }
	    }
	};

	return location;
});
