app.factory('ssnocService',function($http) {
			
       var service = {
        
			getDirectory : function() {
				return $http.get('/api/ssnoc/directory');
			},
			getMember : function(username) {
				return $http.get('/api/ssnoc/member/'+ username);

			},
			create : function(member) {
				return $http.post('/api/ssnoc/member/'+ member.username +"/"+member.password);

			},
			updateStatus : function(member_id,status_id){
				return $http.post('/api/ssnoc/update_status/'+member_id +"/"+status_id);
			},

			addPublicMessage : function(message,user_id){
		  		return $http.post('/api/ssnoc/message/' + user_id + '/' + message);
			},
			getPublicMessages : function(){
				return $http.get('/api/ssnoc/messages');
			},
			addPrivateMessage : function (message, senderId, receiverId){
		  		return $http.post('/api/ssnoc/private_message/' + senderId + '/' + receiverId + '/' + message);
			}

			// delete : function(id) {
			// 	return $http.delete('/api/ssnoc/' + id);
			// }
		}

		return service;

});