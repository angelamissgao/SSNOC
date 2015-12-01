app.factory('member', function(){
	
  function Member(){
    this.id = 0;
    this.username = "";
    this.password = "";
    this.status = 0;
    this.permissionId = 0;
    this.authenticated  = false;
    this.position = {lat: 0, lng: 0};
    this.accountStatus = 0;
  }

	function Member(id, username, password, status, permissionId, accountStatus) // jshint ignore:line
  {
    // Public properties, assigned to the instance ('this')
    this.id = id;
    this.username = username;
    this.password = password;
    this.status = status;
    this.permissionId = permissionId;
    this.accountStatus = accountStatus;
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

  Member.prototype.setPermission = function(permissionId)
  { 
      this.permissionId = permissionId;
  }

  Member.prototype.isAdministrator = function(){
    if(this.permissionId == 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  };

  Member.prototype.isCoordinator = function(){
    if(this.permissionId == 2)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  Member.prototype.isMonitor = function(){
    if(this.permissionId == 3)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  Member.prototype.isCitizen = function(){
    if(this.permissionId == 0)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  Member.prototype.isActive = function(){
    if(this.accountStatus == 0)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

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