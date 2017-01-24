/**
 * Created by tariklaasri on 22/06/15.
 */

angular.module('starter.services', [])

  .factory('CustomGoogleCalendar', function ($rootScope, $http, $q, $cordovaGeolocation) {
    return {
      GetEvents: function () {
        var deferred = $q.defer();
        var promise = deferred.promise;

        if (gapi !== undefined && gapi.client !== undefined && gapi.client.calendar !== undefined) {
          var request = gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime'
          });

          request.execute(function (resp) {
            var events = [];
            if (resp.items.length > 0) {
              for (var i = 0; i < resp.items.length; i++) {
                var event = resp.items[i];

                // Make sure it has date.
                if (!event.start.dateTime) {
                  event.start.dateTime = event.start.date;
                }

                // Make sure it has location.
                var location = event.location;
                if (location) {
                  events.push(event);
                }
              }
              deferred.resolve(events);
            }
            else {
              deferred.reject('No data available.');
            }
          });
        }
        else {
          deferred.reject(403);
        }

        promise.success = function (fn) {
          promise.then(fn);
          return promise;
        };
        promise.error = function (fn) {
          promise.then(null, fn);
          return promise;
        };

        return promise;
      },
      Geocode: function (addressString) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + addressString + "&key=" + API_KEY + "";

        if (addressString == undefined) {
          deferred.reject("Please provide an address.");
        }

        $http({
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: "POST",
          url: url
        }).success(function (data) {
          if (data) {
            deferred.resolve(data);
          }
          else {
            deferred.reject('No data available.');
          }
        }).error(function (data, status, headers, config) {
          deferred.reject(data, status);
        });

        promise.success = function (fn) {
          promise.then(fn);
          return promise;
        };
        promise.error = function (fn) {
          promise.then(null, fn);
          return promise;
        };

        return promise;

      },
      compareTimes: function (event) {
        var minutes = 1000 * 60;
        var hours = minutes * 60;
        var days = hours * 24;

        var date1 = new Date();

        var date2 = new Date(event.start.dateTime);
        var timediff = date2 - date1;
        var ans = Math.floor(timediff / 1000);

        function secondsToHms(d) {
          d = Number(d);
          var h = Math.floor(d / 3600);
          var m = Math.floor(d % 3600 / 60);
          var s = Math.floor(d % 3600 % 60);

          return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m);// + ":" + (s < 10 ? "0" + s : s));
        }

        var obj = {};

        obj.text = secondsToHms(ans);
        obj.value = ans;

        return obj;
      },
      compareLocations: function (event, mode) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        var travel_mode = google.maps.DirectionsTravelMode.DRIVING;

        switch (mode) {
          case "driving":
            travel_mode = google.maps.DirectionsTravelMode.DRIVING;
            break;

          case "walking":
            travel_mode = google.maps.DirectionsTravelMode.WALKING;
            break;

          case "cycling":
            travel_mode = google.maps.DirectionsTravelMode.BICYCLING;
            break;

          case "transit":
            travel_mode = google.maps.DirectionsTravelMode.TRANSIT;
            break;

          default:
            travel_mode = google.maps.DirectionsTravelMode.DRIVING;
            break;
        }

        console.log(travel_mode);

        // Get current location.
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation
          .getCurrentPosition(posOptions)
          .then(function (position) {

            if (event.location == undefined) {
              deferred.reject("Please provide an address.");
            }

            var origin = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            var directionsService = new google.maps.DirectionsService();
            var directionsRequest = {
              origin: origin,
              destination: event.location,
              travelMode: travel_mode,
              unitSystem: google.maps.UnitSystem.METRIC
            };
            directionsService.route(directionsRequest, function (response, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                console.log(response);

                var travelTime = response.routes[0].legs[0].duration;
                deferred.resolve(travelTime);
              }
              else {
                // Error has occured.
                deferred.reject('No data available.');
              }
            });

          }, function (err) {
            // error
          });

        promise.success = function (fn) {
          promise.then(fn);
          return promise;
        };
        promise.error = function (fn) {
          promise.then(null, fn);
          return promise;
        };

        return promise;

        // Get event location.
        // Return travelling time.
      }
    }
  })

  .factory('$cordovaGeolocation', function ($q) {
    return {
      getCurrentPosition: function (options) {
        var q = $q.defer();

        navigator.geolocation.getCurrentPosition(function (result) {
          q.resolve(result);
        }, function (err) {
          q.reject(err);
        }, options);

        return q.promise;
      },

      watchPosition: function (options) {
        var q = $q.defer();

        var watchID = navigator.geolocation.watchPosition(function (result) {
          q.notify(result);
        }, function (err) {
          q.reject(err);
        }, options);

        q.promise.cancel = function () {
          navigator.geolocation.clearWatch(watchID);
        };

        q.promise.clearWatch = function (id) {
          navigator.geolocation.clearWatch(id || watchID);
        };

        q.promise.watchID = watchID;

        return q.promise;
      },

      clearWatch: function (watchID) {
        return navigator.geolocation.clearWatch(watchID);
      }
    };
  })

;