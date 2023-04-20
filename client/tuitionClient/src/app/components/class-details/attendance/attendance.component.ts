import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Enrollment } from 'src/app/model';
import { AttendanceService } from 'src/app/services/attendance.service';
import { EnrolService } from 'src/app/services/enrol.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent {

  constructor(private enrolSvc:EnrolService, private activatedRoute: ActivatedRoute,
              private attendanceSvc: AttendanceService){  }

  currentClassName: string = ''   // store current className
  currentClassYear: number = 0    // store current classYear
  currentSchedule: string = ''    // store current schedule
  classStudents: Enrollment[] = []
  isPastSchedule: boolean = true;

  ngOnInit(){
    this.currentClassName = this.activatedRoute.snapshot.params['className']
    console.info(this.currentClassName)
    this.currentClassYear = this.activatedRoute.snapshot.params['classYear']
    console.info(this.currentClassYear)
    this.currentSchedule = this.activatedRoute.snapshot.params['schedule']
    console.info(this.currentSchedule)

    // Set boolean to check if schedule is before today --> cannot mark attendance for past schedule
    let scheduleDate:Date = new Date( this.currentSchedule)  
    let today:Date = new Date()
    today.setHours(0,0,0,0)
    if(scheduleDate>today){  this.isPastSchedule=false}

    this.getAttendance()
  }

  getAttendance(){
    this.attendanceSvc.getAttendance(this.currentClassYear, this.currentClassName, this.currentSchedule)
                        .then(e => this.classStudents = e)
  }

  markAttendance(phoneNum: number){
    console.info('Check phoneNum: ', phoneNum)
    let attendanceObj = {
        phoneNum: phoneNum,
        className: this.currentClassName,
        classYear: this.currentClassYear,
        classDate: this.currentSchedule
      }
    console.info('Check the attendanceObj: ', attendanceObj)
    this.attendanceSvc.markAttendance(attendanceObj)
                        .then(() => this.getAttendance())
    
  }

}
