import { Component, Inject } from '@angular/core';
import { DatePipe } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClassDetail, Enrollment, Schedule, Student } from 'src/app/model';
import { ClassService } from 'src/app/services/class.service';
import { EnrolService } from 'src/app/services/enrol.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StudentService } from 'src/app/services/student.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AttendanceDialogComponent } from './attendance-dialog/attendance-dialog.component';


@Component({
  selector: 'app-class-details',
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.css']
})
export class ClassDetailsComponent {

  // Check for clashed schedules

  addSchedule: boolean = false;   editSchedule: boolean = false;
  scheduleForm!: FormGroup
  currentClassName: string = '' // for storing className
  currentClassYear: number = 0  // for story classYear
  updateMsg: string = ''    // for storing add Schedule msg/error
  schedules: Date[] = []      // store schedules of currentClass
  todaysDate: Date = new Date;  // for having min Date for schedule

  classDetails!: ClassDetail
  classStartDate!: Date             // part of classDetails
  totalSessions: number = 0         // part of classDetails

  constructor(private fb: FormBuilder, private datepipe: DatePipe,
                private activatedRoute: ActivatedRoute, private classSvc:ClassService,
                private enrolSvc: EnrolService, private msgSnackBar: MatSnackBar,
                private attendanceSvc: AttendanceService, private dialog:MatDialog){}


  
  ngOnInit(){
    console.info('Init called now')
    this.currentClassName = this.activatedRoute.snapshot.params['className']
    this.currentClassYear = this.activatedRoute.snapshot.params['classYear']
    this.getSchedules()     // List schedules for class
    //this.createSearchForm()
    this.getClassDetails()
    this.getEnrollments()   // display students in class Details
  }

  openSnackBar() {
    // this.msgSnackBar.openFromComponent(SnackBarMsgComponent, {
    //   duration: 5 * 1000,
    // });
    console.info(this.updateMsg)
    this.msgSnackBar.open(this.updateMsg, "X" , { duration: 7000, panelClass: ['classSnackbar']})
  }

  compareDate(date: Date): boolean{     // used in schedules -> only allow edit for future classes
    return new Date(date) > new Date
  }

  openAddSchedule(){        // Open schedule form
    this.addSchedule = true
    this.createForm()       // reset form
    this.updateMsg = ''     // reset updateMsg
   }
  closeAddEditSchedule(){ 
    this.addSchedule = false
    this.editSchedule = false
  }   // Close schedule form


  createForm(){             // form for add & edit schedule
    this.scheduleForm = this.fb.group({
      scheduleDate: this.fb.control('', Validators.required),
      hour: this.fb.control<number>(0, Validators.required),
      minute: this.fb.control<number>(0, Validators.required),
      repeat: this.fb.control<string>('No Repeat', Validators.required)
    })
  }

  saveSchedule(){         
    console.info(this.scheduleForm.value)
    // try converting date
    let latest_date =this.datepipe.transform(this.scheduleForm.value.scheduleDate, 'yyyy-MM-dd');
    // create SQL datetime string
      // adding zero for single digits: for server DateTimeFormatter
      let hour = ''
      if(this.scheduleForm.value.hour<10){  hour = `0${this.scheduleForm.value.hour}` }
      else{ hour = this.scheduleForm.value.hour }

      let minute = ''
      if(this.scheduleForm.value.minute<10){  minute = `0${this.scheduleForm.value.minute}`}
      else{ minute = this.scheduleForm.value.minute }

    let datetime = `${latest_date} ${hour}:${minute}:00`
    console.info('check datetime entry: ',datetime)

    const clash: boolean = 
        this.classSvc.checkClashingSchedules(datetime, this.schedules)  // check clashing schedules
    if(clash){      
      this.updateMsg = 'CLASH WITH OTHER SCHEDULE'
      this.openSnackBar()
    }

    else{
    const schedule =
                  { className: this.currentClassName, 
                    classYear: this.currentClassYear, 
                    classDate: datetime,
                    repeat: this.scheduleForm.value.repeat,
                    schedules: this.schedules     // send to back end to check for repeat
                  }
    this.classSvc.addSchedule(schedule)
                .then(() => 
                  { 
                    this.getSchedules()
                    this.updateMsg =  `Added schedule: ${ this.datepipe.transform(new Date(datetime), 'M/d/yy, h:mm a' )}`
                    this.openSnackBar()
                    this.closeAddEditSchedule()
                  })
                .catch(error => 
                  { console.error("error: ", error)
                    this.updateMsg = 'CLASH with other schedule'
                    this.openSnackBar()
                  } )
    }
  }

  openUpdateSchedule(s: Date){ 
    this.editSchedule = true 
    this.scheduleOldDateTime = s
    let schedule = new Date(s)
    this.scheduleForm = this.fb.group({
      scheduleDate: this.fb.control<Date>(schedule, Validators.required),
      hour: this.fb.control<number>(schedule.getHours(), Validators.required),
      minute: this.fb.control<number>(schedule.getMinutes(), Validators.required),
    }) 
  }

  scheduleOldDateTime: Date = new Date  // to use for updateSchedule below

  updateSchedule(){       // set up form input to required SQL input format
    let latest_date =this.datepipe.transform(this.scheduleForm.value.scheduleDate, 'yyyy-MM-dd');
    let updateDateTime = { oldDateTime: this.scheduleOldDateTime, 
      newDateTime: `${latest_date} ${this.scheduleForm.value.hour}:${this.scheduleForm.value.minute}:00`}
    
    const clash: boolean = this.classSvc.checkClashingSchedules(updateDateTime.newDateTime, this.schedules)
    if(clash){
      this.updateMsg = 'CLASH WITH OTHER SCHEDULE'
      this.openSnackBar()
    }

    else{
    this.classSvc.updateSchedule(this.currentClassYear, this.currentClassName, updateDateTime)
                  .then(() => { this.getSchedules()
                                this.updateMsg = 
                                  `updated ${ this.datepipe.transform(new Date(this.scheduleOldDateTime), 'M/d/yy, h:mm a' )} 
                                    to ${ this.datepipe.transform( updateDateTime.newDateTime, 'M/d/yy, h:mm a' )}`
                                this.editSchedule = false
                                this.openSnackBar()
                              })
    }
  }

  deleteSchedule(s: Date){  
    this.classSvc.deleteSchedule(this.currentClassYear, this.currentClassName, s)
                .then(() => 
                {
                  this.getSchedules()
                  this.updateMsg = 
                    `Deleted ${ this.datepipe.transform(new Date(s), 'M/d/yy, h:mm a' )}`
                  this.openSnackBar()
                })
  }

  getSchedules(){
    console.info('Get Schedules now')
    this.classSvc.getSchedules(this.currentClassYear, this.currentClassName)
                  .then(v => 
                    {
                      this.schedules = v 
                      if(this.schedules.length > 0){
                        console.info('working on schedules')
                        this.classStartDate=      // get min Date: set class Start Date
                          this.schedules.reduce(function (a, b) {return a < b ? a : b; })
                        this.totalSessions =      // count past classes: set total Sessions
                          this.schedules.filter(e => new Date(e) < this.todaysDate ).length
                        }
                    }
                  )
  }

  getClassDetails(){
    this.classSvc.getClassDetails(this.currentClassYear, this.currentClassName)
                  .then(v => this.classDetails = v)
  }


  selectedStudent!: Student
  enrolsColumnsToDisplay = ['studentId', 'name', 'phoneNum','status' ,'expiryDate'];
  enrollments: Enrollment[] = []         // contain enrollments of currentClass
  // allAttendance: any[] = []
  // attendanceColumnsToDisplay: string[] = []

  getEnrollments(){
    this.enrolSvc.getEnrollments(this.currentClassYear, this.currentClassName)
                    .then(e => {this.classSvc.enrollments = e     // put enrollments in Svc: for enrollment component
                                this.enrollments = e
                              })
                    .catch(error => console.error('error in getEnrollments: ', error))
  }


  getClassAttendance(){   // get table for overall class attendance
    this.attendanceSvc.getClassAttendance(this.currentClassYear, this.currentClassName)
                        .then((v:any) => {
                          console.info(v) 

                          this.dialog.open(AttendanceDialogComponent, {
                            data:  { allAttendance : v.attendance,
                                      attendanceColumnsToDisplay : v.scheduleList,
                                    }, 
                            width: '500px',
                          });

                        })
  }


}


