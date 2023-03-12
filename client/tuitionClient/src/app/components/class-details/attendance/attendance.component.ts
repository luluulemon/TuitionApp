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
  currentSchedule: string = ''    // store current schedule
  classStudents: Enrollment[] = []

  ngOnInit(){
    this.currentClassName = this.activatedRoute.snapshot.params['className']
    this.currentSchedule = this.activatedRoute.snapshot.params['schedule']
    this.getAttendance()
  }

  getAttendance(){
    this.attendanceSvc.getAttendance(this.currentClassName, this.currentSchedule)
                        .then(e => this.classStudents = e)
  }

  markAttendance(phoneNum: number){
    console.info('Check phoneNum: ', phoneNum)
    let attendanceObj = {
        phoneNum: phoneNum,
        className: this.currentClassName,
        date: this.currentSchedule
      }
    console.info('Check the attendanceObj: ', attendanceObj)
    this.attendanceSvc.markAttendance(attendanceObj)
                        .then(() => this.getAttendance())
    
  }

}
