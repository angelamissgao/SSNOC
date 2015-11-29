app.factory('message', function(){
	
	function Message(id,message, memberId, receiverId, status, date, poistionLat, positionLng) {
    // Public properties, assigned to the instance ('this')
    this.id = id;
    this.memberId = memberId;
    this.receiverId = receiverId;
    this.message = message;
    this.status = status;
    this.date = new Date(date);
    this.position.lat = positionLat;
    this.position.lng = positionLng;
  }

  function Message(data) // jshint ignore:line
  {
    this.id = data.id;
    this.memberId = data.memberId;
    this.receiverId = data.receiverId;
    this.message = data.message;
    this.status = data.status;
    this.date = new Date(data.date);
    this.positionLat = data.positionLat;
    this.positionLng = data.positionLng;
  }

  Message.prototype.isAnnoucement = function()
  {
    if(this.receiverId == 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  };


  return Message;
});
