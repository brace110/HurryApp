/**
 * Created by tariklaasri on 22/06/15.
 */


// TODO fill in these values with your own keys.
var CLIENT_ID = '';
var CLIENT_ID_IOS = '';
var CLIENT_SECRET_ID_IOS = "";
var SCOPES = ["https://www.googleapis.com/auth/calendar"];
var SCOPE = "https://www.googleapis.com/auth/calendar.readonly";

var API_KEY = "";

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'googleApi'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        });
    })

    .config(function (googleLoginProvider) {
        googleLoginProvider.configure({
            clientId: CLIENT_ID,
            scopes: SCOPES,
            redirect_uri: 'http://localhost/callback'
        });
    })
;