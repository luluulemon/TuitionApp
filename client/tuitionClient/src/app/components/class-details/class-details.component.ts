import { Component } from '@angular/core';
import { DatePipe } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClassDetail, Enrollment, Schedule, Student } from 'src/app/model';
import { ClassService } from 'src/app/services/class.service';
import { EnrolService } from 'src/app/services/enrol.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StudentService } from 'src/app/services/student.service';


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
                private enrolSvc: EnrolService, private msgSnackBar: MatSnackBar){}


  
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
    let datetime = `${latest_date} ${this.scheduleForm.value.hour}:${this.scheduleForm.value.minute}:00`
    console.info('check datetime entry: ',datetime)

    const clash: boolean = 
        this.classSvc.checkClashingSchedules(datetime, this.schedules)  // check clashing schedules
    if(clash){      
      this.updateMsg = 'CLASH WITH OTHER SCHEDULE'
      this.openSnackBar()
    }

    else{
    const schedule: 
      Schedule = {  className: this.currentClassName, 
                    classYear: this.currentClassYear, 
                    classDate: datetime }
    this.classSvc.addSchedule(schedule)
                .then(v => 
                  { 
                    this.getSchedules()
                    this.updateMsg =  `Added schedule: ${ this.datepipe.transform(new Date(datetime), 'M/d/yy, h:mm a' )}`
                    this.openSnackBar()
                    this.closeAddEditSchedule()
                  })
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


  // studentSearchForm!: FormGroup
  // addStudentForm!: FormGroup
  // students: Student[] = []            // for students tab -> add students
  // studentsDisplay: Student[] = []     // students search table pagination (limit to 5)
  // columnsToDisplay = ['studentId', 'name', 'phoneNum', 'joinDate'];   // for students tab table
  // offset: number = 0
  // nextPageBoolean: boolean = false
  // addStudentStatement: string = ''
  selectedStudent!: Student
  enrolsColumnsToDisplay = ['studentId', 'name', 'phoneNum','status' ,'expiryDate'];
  enrollments: Enrollment[] = []         // contain enrollments of currentClass


  getEnrollments(){
    this.enrolSvc.getEnrollments(this.currentClassYear, this.currentClassName)
                    .then(e => {this.classSvc.enrollments = e     // put enrollments in Svc: for enrollment component
                                this.enrollments = e
                              })
                    .catch(error => console.error('error in getEnrollments: ', error))
  }



}
