app.factory('message', function(){
	
	function Message(id,message, memberId, receiverId, status, date, poistionLat, positionLng) {
    // Public properties, assigned to the instance ('this')
    this.id = id;
    this.memberId = memberId;
    this.receiverId = receiverId;
    this.message = message;
    this.status = status;
    this.timestamp = new Date(date);
    this.position ={ lng : 0, lat: 0};
    this.position.lat = positionLat;
    this.position.lng = positionLng;
  }

  function Message(data) // jshint ignore:line
  {
    this.id = data._id;
    this.memberId = data.member_id;
    this.receiverId = data.receiver_id;
    this.message = data.message;
    this.status = data.status;
    this.timestamp = new Date(data.timestamp);
    this.position ={ lng : 0, lat: 0};
    this.position.lat = data.position.lat;
    this.position.lng = data.position.lng;
  }


  Message.prototype.isPublicMessage = function()
  {
    if(this.receiverId == 0)
    {
      return true;
    }
    else
    {
      return false;
    }
  };


  Message.prototype.isAnnouncement = function()
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

  Message.prototype.isEmergency = function()
  {
    if(this.receiverId == 999)
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


// {message: String, member_id: Number, receiver_id: {type:Number, default: 0}, 
//   status: Number, timestamp:{ type: Date, default: Date.now }, position:{lng: Number, lat: Number}});