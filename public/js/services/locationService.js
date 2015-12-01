app.factory('locationService',function($rootScope) {
	var location = {
        
	    //Shake detection
	    getLocation : function() {
	    	navigator.geolocation.getCurrentPosition(this.setLocation);
	    },
	    setLocation : function(position) {
	      if(position!==undefined) {
	    var vlat = Number((position.coords.latitude).toFixed(3));
        var vlong = Number((position.coords.longitude).toFixed(3));
        $rootScope.currentPosition = {lat: vlat, lng: vlong};
		}
	    }
	};

	return location;
});
