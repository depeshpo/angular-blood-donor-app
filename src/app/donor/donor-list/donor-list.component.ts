import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// importing firebase for real time database used in the project
import * as firebase from 'firebase';

// Declaring the basic required google maps variable
declare var google: any;
let map: any;
let marker: any;
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};
let infowindow: any;
const iconBase = 'http://maps.google.com/mapfiles/ms/icons/';

// To extract the firebase realtime database
export const snapshotToArray = (snapshot: any) => {
  const returnArr = [];

  snapshot.forEach((childSnapshot: any) => {
    const item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item)
  });
  return returnArr;
};

@Component({
  selector: 'app-donor-list',
  templateUrl: './donor-list.component.html',
  styleUrls: ['./donor-list.component.css']
})
export class DonorListComponent implements OnInit {

  @ViewChild('map', { static: false }) mapElement: ElementRef;

  donors = [];

  constructor() {
    // to capture data from firebase automatically fetch on every value changes in firebase realtime db.
    firebase.database().ref('donors/').on('value', resp => {
      this.donors = [];
      this.donors = snapshotToArray(resp)
      // display donor position to google maps
      for (const donor of this.donors) {
        this.createMarkers(donor);
        console.log(donor.name);
      }
    });
    this.initMap()
  }

  ngOnInit() {
  }

  initMap() {
    navigator.geolocation.getCurrentPosition((location) => {

      map = new google.maps.Map(this.mapElement.nativeElement, {
        center: { lat: location.coords.latitude, lng: location.coords.longitude },
        zoom: 15
      });

      infowindow = new google.maps.InfoWindow();

      marker = new google.maps.Marker({
        position: { lat: location.coords.latitude, lng: location.coords.longitude },
        map,
        title: 'Click to zoom',
        icon: iconBase + 'blue-dot.png'
      });

      map.addListener('center_changed', () => {
        window.setTimeout(() => {
          map.panTo(marker.getPosition());
        }, 3000);
      });

      marker.addListener('click', (event: any) => {
        console.log(marker.getPosition().lat());
        console.log(marker.getPosition().lng());
        infowindow.setPosition(event.latLng);
        infowindow.setContent('<h2>Yes, I wanna be a donor!</h2>' +
          '<h3><a href="/add-donor/' + marker.getPosition().lat() + '/' + marker.getPosition().lng() + '">Register Here</a></h3>');
        infowindow.open(map, marker);
      });
    }, (error) => {
      console.log(error);
    }, options);
  }

  // for marker creation when place is provided
  createMarkers(place: any) {
    const latitude = parseFloat(place.coords.latitude);
    const longitude = parseFloat(place.coords.longitude);
    const donorMarker = new google.maps.Marker({
      map,
      position: { lat: latitude, lng: longitude },
      icon: iconBase + 'green-dot.png'
    });

    google.maps.event.addListener(donorMarker, 'click', function() {
      infowindow.setContent('<h3>'+ place.name +'</h3> <p> Phone number:'+ place.phone +'<br> Email: '+ place.email +'</p>');
      infowindow.open(map, this);
    });
  }

}
