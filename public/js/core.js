var app = angular.module('ssnoc',['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
        // $rootscope ="hello world",
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'login.html',
                controller  : 'mainController'
            })

            // // route for the about page
            .when('/chatting', {
                templateUrl : 'chat.html',
                controller  : 'chatController'
            })
    
            .when('/directory',{
                templateUrl: 'directory.html',
                controller:'chatController'
            })

            .when('/inbox', {
                templateUrl : 'inbox.html',
                controller  : 'chatController'
            })

            .when('/announcements', {
                templateUrl : 'announcement.html',
                controller  : 'chatController'
            })

            .when('/privatechat', {
                templateUrl : 'privatechat.html',
                controller  : 'privateChatController'
            })

    }]);

app.run(function($rootScope, ssnocService){

    $rootScope.id;    
    $rootScope.name;
    $rootScope.receiverId;
    $rootScope.socket = io.connect(); 
    $rootScope.currentPosition = {lat: 0, lng: 0};
    $rootScope.currentPosition.lat = 0;    
    $rootScope.currentPosition.lng = 0;    
    $rootScope.authenticated = false;
    $rootScope.statuses = [
      {name:"OK", id:1},
      {name:"Help", id:2},
      {name:"Emergency", id:3}
    ];
    
    getLocation();

    function getLocation(){
      navigator.geolocation.getCurrentPosition(showLocation);
    }

    function showLocation(position) {
      console.log("core::showLocation: %s", $rootScope.currentPosition);
      if(position!==undefined) {
        $rootScope.currentPosition = position;
      }
    }

     $rootScope.shareStatus= function(status_id){
     //1-ok 2-help 3-emergency 0-logout

      console.log("update status in core" + status_id);
      // ssnocService.updateStatus($rootScope.id, $rootScope.currentPosition, status_id);
      ssnocService.updateStatus($rootScope.id, status_id);
    }

    $rootScope.logout = function()
    {
      ssnocService.updateStatus($rootScope.id, $rootScope.currentPosition, 0).
      success(function(response){
          console.log("logout" + response);
          $rootScope.authenticated = false;
          window.location = "/";
      });
    }

    $rootScope.socket.on('disconnect', function(){
      console.log("disconnecting" + $rootScope.id);
      ssnocService.updateStatus($rootScope.id, 0);
      $scope.$apply();
    });

});

/**
 * Slideout directive.
 * Controls animation of slideout menu.
 *
 * @module slideout
 */
app.directive('slideout', ['$document', '$window', '$timeout', function($document, $window, $timeout) {
    /* Global setup */

    // Create overlay element
    var overlay_element = angular.element(document.createElement('div'));
    overlay_element.addClass('slideout-overlay');
    $document[0].body.appendChild(overlay_element[0]);

    // Initialize global array to track of visible instance
    var slideouts_visible = [];

    return {
        restrict: 'A',
        scope: false,
        link: function($scope, element, attrs) {
            /* Instance setup */

            // Boolean expression which determines slideout state
            var expression = attrs.slideout;

            // Set expression to false on click overlay
            // (TODO) this assumes that the expression is just a variable :-/
            overlay_element.on('click', function () {
                $scope.$apply(function () {
                    $scope[attrs.slideout] = false;
                });
            });

            // Animation queue
            var queue = [];

            // Update slideouts visible
            element.data('slideout_id', slideouts_visible.length);
            slideouts_visible.push(0);

            // Initialize classes
            var direction = attrs.slideoutDirection;
            if (direction === 'from-left') {
                element.addClass('slideout-from-left');
            } else {
                direction = 'from-right';
                element.addClass('slideout-from-right');
            }
            element.addClass('slideout');
            element.addClass('slideout-closed');


            /**
             * Ensures slideout is animated only after finished animating
             */
            var execute_next_in_queue = function () {
                if (!element.data('is_animating')) {
                    var type = queue.shift();

                    if (type) {
                        animate(type);

                        /*
                         * Timeout to notify end of animation.
                         * (TODO) Would prefer to use .on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd")
                         *        but couldn't get it to wocrk consistently.
                         */
                        $timeout(function() {
                            element.data('is_animating', false);
                            execute_next_in_queue();
                            if (type === 'close') {
                                element.addClass('slideout-closed');
                            }
                        }, (attrs.slideout_duration || 0.5)*1000);
                    }

                }
            };


            /**
             * Update number of slideouts visible. Parent scope can access
             * variable `$scope.slideout_open` to check if any slideouts visible.
             */
            var updateSlideoutOpen = function (state) {
                slideouts_visible[element.data('slideout_id')] = state;
                var count = 0;

                for (var i = 0; i < slideouts_visible.length; i ++) {
                    var is_visible = slideouts_visible[i];
                    count += is_visible;
                }

                if (count) {
                    $scope.slideout_open = true;
                    overlay_element.addClass('slideout-overlay-show');
                    $document.find('body').addClass('slideout-prevent-scroll')
                } else {
                    $scope.slideout_open = false;
                    overlay_element.removeClass('slideout-overlay-show');
                    $document.find('body').removeClass('slideout-prevent-scroll')
                }
            };

            /**
             * Add relevant classes for animation of slideout.
             */
            var animate = function (type) {
                if (type === 'open') {
                    element.data('is_animating', true);
                    if (direction === 'from-right') {
                        element.addClass('slideLeft');
                        element.removeClass('slideRight');
                    } else if (direction === 'from-left') {
                        element.removeClass('slideLeft');
                        element.addClass('slideRight');
                    }
                    element.addClass('slideout-open');
                    element.removeClass('slideout-closed');
                    updateSlideoutOpen(1);

                } else if (type === 'close') {
                    element.data('is_animating', true);
                    if (direction === 'from-right') {
                        element.removeClass('slideLeft');
                        element.addClass('slideRight');
                    } else if (direction === 'from-left') {
                        element.addClass('slideLeft');
                        element.removeClass('slideRight');
                    }
                    element.removeClass('slideout-open');
                    updateSlideoutOpen(0);
                }
            }

            /**
             * Queue for animating.
             */
            var addToQueue = function(type) {
                queue.push(type);
                execute_next_in_queue();
            };

            if ($scope.$eval(expression)) {
                addToQueue('close')
            }

            /**
             * Watch for changes to expression and animate accordingly.
             */
            $scope.$watch(expression, function(new_val, old_val) {
                if (typeof($scope[attrs.slideout]) === 'object' || typeof($scope[attrs.slideout]) === 'function') {
                    // Required to be a variable so that the overlay can reset it upon to close all.
                    console.error('Slideout value should not be a function or object');
                    console.log('Slideout value should not be a function or object');
                }

                if (new_val === old_val) {
                    return;
                } else if (new_val) {
                    addToQueue('open')
                } else {
                    addToQueue('close');
                }
            });
        }
    }
}]);

