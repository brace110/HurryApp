/**
 * Created by tariklaasri on 22/06/15.
 */

angular.module('starter.controllers', ['googleApi'])

    .controller('DefaultCtrl', function ($scope, googleLogin, googleCalendar, googlePlus, CustomGoogleCalendar) {

        $scope.mySelect = "driving";
        $scope.showLogin = true;

        $scope.showSelectValue = function (mySelect) {
            $scope.mySelect = mySelect;
        };

        $scope.login = function () {
            googleLogin.login()
                .then(function (data) {
                    $scope.showLogin = false;
                })
        };

        $scope.$on("googlePlus:loaded", function () {
            googlePlus.getCurrentUser().then(function (user) {
                $scope.currentUser = user;
            });
        });

        $scope.currentUser = googleLogin.currentUser;

        $scope.loadCalendars = function () {
            $scope.calendars = googleCalendar.listCalendars();
        };

        $scope.checkIfLate = function () {
            var events = $scope.calendarItems;
            $scope.checkingIfLate = true;
            for (var i = 0; i < events.length; i++) {
                // Update the time untill this event starts.
                events[i].timeTillStart = CustomGoogleCalendar.compareTimes(events[i]);

                // Compare current location to event location and extract traveling time.
                (function (e) {
                    CustomGoogleCalendar.compareLocations(e, $scope.mySelect)
                        .success(function (data) {
                            console.log(data);
                            console.log(e);

                            e.travelTime = data;

                            // Check if traveling time is larger than the time untill it starts,
                            // Also check if the event hasn't already started more than 5 minutes ago.
                            if (e.timeTillStart.value <= data.value) {// && e.timeTillStart.value > -300) {
                                if (!e.warned) {
                                    alert("Hurry up for " + e.summary + "!");
                                }
                                e.warned = true;
                            }
                        })
                        .error(function () {
                        });
                })(events[i]);
            }
            $scope.checkingIfLate = false;

            setTimeout($scope.checkIfLate, 10000);
        };

        $scope.doRefresh = function () {
            CustomGoogleCalendar.GetEvents()
                .success(function (events) {
                    $scope.calendarItems = events;

                    console.log($scope.calendarItems);

                    $scope.checkIfLate();
                })
                .error(function (error) {
                    if (error == 403) {
                        $scope.calendarItems = {event: {summary: "Please login first."}};
                    }
                    console.log(error);
                })
                .finally(function () {
                    // Success or failure, let the refresher know the call is done.
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };
    })

;