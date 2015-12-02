app.controller("editProfileController",function($scope, ssnocService, member, $rootScope){
  $scope.profile = new member();

  getProfile();

  function getProfile() {
    ssnocService.getMemberById($rootScope.profileMemberId)
      .success(function(data) {
        $scope.profile = new member(data._id, data.name, data.password, data.status, data.permissionId,data.accountStatus);
      });
  }
      
  $scope.updateProfile = function() {
    result = $rootScope.validateSignInDetails($scope.profile.username, $scope.profile.password, $scope.profile.password);
    if (result.validateResult) {
      ssnocService.updateProfile($scope.profile.id, $scope.profile.username, $scope.profile.password, $scope.profile.permissionId, $scope.profile.accountStatus)
        .success(function(data) {
          window.location = "/#/directory";
        });
    }
    else {
      $scope.message = result.message;
    }

  };

  $scope.cancel = function() {
    window.location = "/#/directory";
  };
});
