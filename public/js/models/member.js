app.factory('member', function(){
	
  function Member(){
    this.id = 0;
    this.username = "";
    this.password = "";
    this.status = 0;
    this.permissionId = 0;
    this.authenticated  = false;
    this.position = {lat: 0, lng: 0};
  }

	function Member(id, username, password, status, permissionId) // jshint ignore:line
  {
    // Public properties, assigned to the instance ('this')
    this.id = id;
    this.username = username;
    this.password = password;
    this.status = status;
    this.permissionId = permissionId;
    this.authenticated  = false;
    this.position = {lat: 0, lng: 0};

  }

  // function Member(username, password, status, permissionId) {
  //   // Public properties, assigned to the instance ('this')
  //   this.id = 0;
  //   this.username = username;
  //   this.password = password;
  //   this.status = status;
  //   this.permissionId = permissionId;
  //   this.authenticated  = false;
  //   this.position = {lat: 0, lng: 0};

  // }

  Member.prototype.isOnline = function()
  {
    if(this.status !== 0)
    {
      return true;
    }
    else
    {
      return false;
    }
  };

  Member.prototype.setStatus = function(statusId)
  {
    this.status = statusId;
  };

  Member.prototype.setAuthentication = function(isAuthenticated)
  { 
      this.authenticated = isAuthenticated;
  };

  Member.prototype.isAdmin = function(){
    if(this.permissionId == 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  };

  Member.prototype.printMember = function(){
    console.log("Id :" + this.id +
                " ,username : " + this.username  +
                " ,password : " + this.password + 
                " ,status : " + this.status + 
                " ,permission : " + this.permissionId + 
                  " ,authentication : " + this.authenticated+
                  " ,position lat : " +this.position.lat + 
                  " ,position lng : " +this.position.lng);
  };

  return Member;
});