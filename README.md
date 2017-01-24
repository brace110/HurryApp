# HurryApp
Application that alerts you if you might be running late for one of your Google Calendar events.
API keys are private and application will not work. Please request your own at Google's API serivce.

This application uses the Ionic Framework.

To run this application please install ionic v1.

    $ sudo npm install -g ionic cordova

Create a new ionic project

    $ ionic start myTitle blank

Clone project or download as zip, copy the /www over the default one you just created.

Now go to /www/js/app.js an fill in your own API Keys.

// Run in browser

    $ ionic serve

// Run on device.

    $ ionic platform add ios/android

    $ ionic run ios/android
