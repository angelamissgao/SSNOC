app.factory('locationService',function($rootScope) {
	var location = {
        
	    //Shake detection
	    getLocation : function() {
	    	navigator.geolocation.getCurrentPosition(this.setLocation);
	    },
	    setLocation : function(position) {
	      if(position!==undefined) {
	    var lat = Number((position.coords.latitude).toFixed(3));
        var lng = Number((position.coords.longitude).toFixed(3));
        $rootScope.currentPosition = {lat: lat, lng: lng};
		}
	    }
	};

	return location;
});
