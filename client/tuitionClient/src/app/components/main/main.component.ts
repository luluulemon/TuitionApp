import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  constructor(private http:HttpClient){}
  validated: boolean = false;     // validate once each session: store in session

  ngOnInit(){
    this.validateEnrolStatus()
  }

  validateEnrolStatus(){
    if(!this.validated){
      console.info('validate student status')
      lastValueFrom( this.http.get('/api/enrol/validateStatus') )
      this.validated = true;
    }
  }
}
