import { Component } from '@angular/core';
// registering the firebase SDK module
import * as firebase from 'firebase';

// configuration variable for accessing Firebase 
const config = {
  apiKey: "AIzaSyCR2SpFSGIvjcndd2BxYrXmdi6sAb-m8cU",
  authDomain: "angular-blood-donor-app.firebaseapp.com",
  databaseURL: "https://angular-blood-donor-app.firebaseio.com",
  projectId: "angular-blood-donor-app",
  storageBucket: "angular-blood-donor-app.appspot.com",
  messagingSenderId: "950355505239",
  appId: "1:950355505239:web:55f018382e998595333312"
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor() {
    firebase.initializeApp(config);
  }

  title = 'blood-donor-app';
}
