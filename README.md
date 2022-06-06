## To Run

1. npm install
2. npm run test

## VPN Banner

A banner has been added to inform users whether their IP address is being masked by Mozilla VPN. It also uses their IP address to demonstrate geolocation. This can inform users why they might use Mozilla VPN for privacy.

The IP location data includes GeoLite2 data created by MaxMind, available from https://www.maxmind.com. For localhost, a test MaxMind database with limited data is included with this repo. For the Heroku Dev site, the following buildpack is used to enable geolocation: https://github.com/HiMamaInc/heroku-buildpack-geoip-geolite2. For stage and prod environments, a shared database is set via env vars.
