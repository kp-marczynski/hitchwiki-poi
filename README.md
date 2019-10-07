# HitchwikiPoi

This app provides simple way to download *.kml file with hitchhiking POI points imported from hitchwiki. Result file is compatible with Maps.me offline maps app

## Demo
https://kp-marczynski.github.io/hitchwiki-poi/

## How to use
Just choose country you want to download *kml file for and then open downloaded file with Maps.me.

If you wish, you can install app on mobile as it utilize PWA functionality

## Important information
* [Download Maps.me mobile app](https://maps.me/download)
* [How to import kml file to Maps.me](https://support.maps.me/hc/en-us/articles/207895029-How-can-I-import-bookmarks-)
* [Hitchwiki maps website](http://hitchwiki.org/maps/) - content used under license [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/) with changed placemark styles to comply with Maps.me

## Development
### Prerequisities
    Node.js
    Angular CLI

### How to run on localhost
    npm install && ionic serve

Then the app will be available on [localhost:8100](localhost:8100)

## Changelog
* 1.4.2 Users can download or generate kml files for each country. App can be used as PWA with locally cached kml files
* 2.0.0 Introduced ionic. App can be installed on mobile. PWA is teporarily not available
