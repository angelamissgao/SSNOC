app.controller("editProfileController",function($scope, ssnocService, member, $rootScope){
  $scope.profile = {};

  getProfile();

  function getProfile() {
    ssnocService.getMemberById($rootScope.profileMemberId)
      .success(function(data) {
        $scope.profile = data;
      });
  }

  $scope.updateAccount = function() {
    ssnocService.updateAccount($rootScope.member)
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
});
