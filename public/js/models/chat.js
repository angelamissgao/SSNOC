app.factory('chat', function(){
	this.currentMsgPage = 0;
  this.pageSize = 10;

	function Chat() {
    // Public properties, assigned to the instance ('this')
    this.directory = []; //members
    this.messages = []; //messages
  }

  Chat.prototype.getMessages = function(){
    return this.messages;
  };


  Chat.prototype.getDirectory = function(){
      return this.directory;
  };

  Chat.prototype.getMember = function(memberId){
    angular.forEach(directory, function(key, value){
        if(value.id == memberId)
        {
          return value;
        }
    }); 
  };

  return Chat;
});
