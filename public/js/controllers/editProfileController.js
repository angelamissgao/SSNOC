app.controller("editProfileController",function($scope, ssnocService, member, $rootScope){
  $scope.profile = {};

  getProfile();

  function getProfile() {
    ssnocService.getMemberById($rootScope.profileMemberId)
      .success(function(data) {
        $scope.profile = data;
      });
  }

  $scope.updateProfile = function() {
    result = $rootScope.validateSignInDetails($scope.profile.name, $scope.profile.password, $scope.profile.password);
    if (result.validateResult) {
      ssnocService.updateProfile($scope.profile._id, $scope.profile.name, $scope.profile.password, $scope.profile.permissionId, $scope.profile.accountStatus)
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
