import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent {
  
  constructor(public sanitizer:DomSanitizer){}
  
  gmap = "https://www.google.com/maps/embed/v1/place?key=AIzaSyD_ltw8dl60u1AVHMrMtqbsrffkrYrTeFs&q=Pioneer+Mall,Singapore"


  
}
