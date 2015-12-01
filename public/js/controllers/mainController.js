app.controller("mainController",function($scope, ssnocService, member, $q,$rootScope){
		$scope.loginDetails = {};
		$scope.loading = true;
		$scope.isExistingMember = true;
		var defer = $q.defer();

		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos
		$scope.login = function(){
			$scope.loading = true;

			findExistingMember().then(function(response){
				if($scope.isExistingMember)
				{
					if (validateLoginDetails($rootScope.member)) {
							// login successfull and send chat.html
							$rootScope.member.setStatus($rootScope.statuses.OK.id);	
							$rootScope.member.setAuthentication(true);
							updateStatus().then(function(response){
								window.location = "/#/chatting";
							});
					}
				}
				else
				{
					console.log($scope.isExistingMember);
				}
			});
		};

		$scope.signup = function()
		{   
			result = $rootScope.validateSignInDetails($scope.loginDetails.username, $scope.loginDetails.password, $scope.loginDetails.confirmPassword);
			if (result.validateResult) {
				createMember();
				window.location = "/#/chatting";
			}
			else {
				$scope.message = result.message;
			}
		};

		function findExistingMember(){
			ssnocService.getMember($scope.loginDetails.username)
				.then(
					function(response){
			
						if(response.data !== null)
						{ 	
							$rootScope.member  = new member(
								response.data._id, 
								response.data.name,
								response.data.password, 
								response.data.status,
								response.data.permissionId,
								response.data.accountStatus);
							$rootScope.member.printMember();
							$scope.isExistingMember = true;
							defer.resolve($scope.isExistingMember);
						}
						else
							// not a member, crete new
						{ 
							
							$scope.message = "no existing member";
							$scope.isExistingMember = false;
							defer.resolve($scope.isExistingMember);

						}
					},
					function(err){
							
							defer.reject(err);
						}
					);

					return defer.promise;			    	
		}


		$scope.logout = function(){
			$scope.loading = true;
			//goOffline();
		};

		
		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		function createMember() {
				$scope.loading = true;
				// call the create function from our service (returns a promise object)
				$rootScope.member = new member(0,
					$scope.loginDetails.username, 
					$scope.loginDetails.password, 
					$rootScope.statuses.OK.id,
					0,
					0);
				$rootScope.member.printMember();
				ssnocService.create($rootScope.member)
					.success(function(data) {
						$scope.loading = false;
						$rootScope.member = new member(
							data._id, 
							data.name, 
							data.password, 
							data.status, 
							data.permissionId,
							data.accountStatus);
						$rootScope.member.printMember();
						$rootScope.member.setAuthentication(true);
						updateStatus();
					});
		}

		
		function validateLoginDetails(data){

			console.log("Data " + data.name);
			if(data !== undefined)
			{
				if(data.password != $scope.loginDetails.password){
					$scope.message = "wrong infomation,please type in again";
					return false;
				}
				else if (data.accountStatus != $rootScope.accountStatusMap.Active.id) {
					$scope.message = "account not active";
					return false;
				}
				else {
					return true;
				}
			}
			else {
				 $scope.message = "wrong infomation";
				 return false;		 
			}
		}

		function updateStatus(){
			console.log("Updates status " + $rootScope.member.id + ", " +  $rootScope.member.username);
			ssnocService.updateStatus($rootScope.member.id, $rootScope.member.position, $rootScope.member.status)
			.then(function(response){
				console.log(response.data);
				$rootScope.member.printMember();
				$scope.loading = false;
				defer.resolve($rootScope.member);
			},function(err){
				defer.reject(err);
			});
			return defer.promise;
		}

});
