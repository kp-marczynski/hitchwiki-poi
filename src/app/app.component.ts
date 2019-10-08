import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    position = '';

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.getPosition();
        });
    }

    getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.displayPosition);
        } else {
            this.position = 'Geolocation is not supported by this browser.';
        }
    }

    displayPosition(geolocationPosition) {
        console.log('Current location: ' + geolocationPosition.coords.latitude + ', ' + geolocationPosition.coords.longitude);
    }
}
