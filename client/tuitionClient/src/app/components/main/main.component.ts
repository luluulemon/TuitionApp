import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ClassService } from 'src/app/services/class.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  constructor(private http:HttpClient, private classSvc: ClassService,
              private activatedRoute: ActivatedRoute){}

  validated: boolean = false;     // validate once each session: store in session
  todaysSchedules: any[] = []
  upcomingSchedules: any[] = []
  currentClassYear: number = new Date().getFullYear()
  userEmail: string = ''

  ngOnInit(){
    this.validateEnrolStatus()
    this.getRecentSchedules()
    this.userEmail = this.activatedRoute.snapshot.params['userEmail']
    // const JSONstring = JSON.stringify(this.userEmail)
    // console.info('Check current User: ', JSONstring)
    // localStorage.setItem("currentUser", JSONstring)
  }

  validateEnrolStatus(){
    if(!this.validated){
      console.info('validate student status')
      lastValueFrom( this.http.get('/api/enrol/validateStatus') )
      this.validated = true;
    }
  }

  getRecentSchedules(){
    this.classSvc.getRecentSchedules()
                  .then((schedules:any) => {
                    this.todaysSchedules = schedules.today
                    this.upcomingSchedules = schedules.upcoming
                  })
  }


}
