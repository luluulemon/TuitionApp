import { Component } from '@angular/core';
import { DatePipe } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClassDetail, Enrollment, Schedule, Student } from 'src/app/model';
import { ClassService } from 'src/app/services/class.service';
import { EnrolService } from 'src/app/services/enrol.service';
import { MatSnackBar } from '@angular/material/snack-bar';


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
  updateMsg: string = ''    // for storing add Schedule msg/error
  schedules: Date[] = []      // store schedules of currentClass
  todaysDate: Date = new Date;  // for having min Date for schedule
  classDetails!: ClassDetail


  constructor(private fb: FormBuilder, private datepipe: DatePipe,
            private activatedRoute: ActivatedRoute, private classSvc:ClassService,
            private enrolSvc: EnrolService, private msgSnackBar: MatSnackBar ){}


  
  ngOnInit(){
    console.info('Init called now')
    this.currentClassName = this.activatedRoute.snapshot.params['className']
    this.getSchedules()
    this.createSearchForm()
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
    const schedule: Schedule = {  className: this.currentClassName, classDate: datetime }
    this.classSvc.addSchedule(schedule)
                .then(v => 
                  { 
                    this.getSchedules()
                    this.updateMsg =  `Added schedule: ${ this.datepipe.transform(new Date(datetime), 'M/d/yy, h:mm a' )}`
                    this.openSnackBar()
                    //this.createForm()
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
    this.classSvc.updateSchedule(updateDateTime)
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
    this.classSvc.deleteSchedule(s)
                .then(() => 
                {
                  this.getSchedules()
                  this.updateMsg = 
                    `Deleted ${ this.datepipe.transform(new Date(s), 'M/d/yy, h:mm a' )}`
                  this.openSnackBar()
                })
  }

  getSchedules(){
    this.classSvc.getSchedules(this.currentClassName)
                  .then(v => this.schedules = v)
  }

  getClassDetails(){
    this.classSvc.getClassDetails(this.currentClassName)
                  .then(v => this.classDetails = v)
  }


  studentSearchForm!: FormGroup
  addStudentForm!: FormGroup
  students: Student[] = []            // for students tab -> add students
  studentsDisplay: Student[] = []     // students search table pagination (limit to 5)
  columnsToDisplay = ['studentId', 'name', 'phoneNum', 'joinDate'];   // for students tab table
  offset: number = 0
  nextPageBoolean: boolean = false
  addStudentStatement: string = ''
  selectedStudent!: Student
  enrolsColumnsToDisplay = ['studentId', 'name', 'phoneNum','status' ,'expiryDate'];
  enrollments: Enrollment[] = []         // contain enrollments of currentClass (call at TabClick)

  startStudentTab(){
    this.getStudents()
    this.createSearchForm()
    this.createAddStudentForm()
    //this.getEnrollments()
  }

  createSearchForm(){ 
    this.studentSearchForm = this.fb.group({ searchName: this.fb.control('') })
  }

  createAddStudentForm(){
    this.addStudentForm = this.fb.group({ startDate: this.fb.control<string>('', Validators.required)})
  }

  getEnrollments(){
    this.enrolSvc.getEnrollments(this.currentClassName)
                    .then(e => this.enrollments = e)
                    .catch(error => console.error('error in getEnrollments: ', error))
  }

  getStudents(){    
    this.classSvc.getStudents()
                  .then(v => 
                    { 
                      this.students = v 
                      if(this.students.length>5)        // create pagination
                      { this.studentsDisplay = [ ... this.students ].splice(0,5)  
                        this.nextPageBoolean = true
                      }
                      else{ this.studentsDisplay = this.students  }
                    })  }

  nextPage(){
    this.offset += 5
    if(this.offset + 5 > this.students.length){ this.nextPageBoolean = false }
    this.studentsDisplay = [ ... this.students ].splice(this.offset, Math.min(5, this.students.length-5))
  }

  previousPage(){
    this.offset -= 5
    this.studentsDisplay = [ ... this.students ].splice(this.offset, 5)
    this.nextPageBoolean = true
  }
  
  searchStudents(){   
    console.info('in search Students')
    console.info(this.studentSearchForm.value.searchName)
    this.classSvc.searchStudents(this.studentSearchForm.value.searchName)
                  .then( v =>
                    { 
                      this.students = v 
                      console.info(this.students.length>5)
                      if(this.students.length>5)        // create pagination
                      { this.studentsDisplay = [ ... this.students ].splice(0,5)  
                        this.nextPageBoolean = true
                      }
                      else{ this.studentsDisplay = this.students 
                            this.nextPageBoolean = false 
                          }
                    } )  
  }

  addStudent(s: Student){
    console.info(s)
    this.selectedStudent = s
    this.addStudentStatement = `Adding ${s.name} to ${this.currentClassName}: `
  }

  confirmAddStudent(){  
    let e = { phoneNum: this.selectedStudent.phoneNum,
              className: this.currentClassName,
              expiryDate: this.addStudentForm.value.startDate  
            }
    console.info(e)
    this.enrolSvc.addEnrollment(e)
            .then(msg => 
              { console.info(msg)           // Log to show if insert happens
                this.enrolSvc.getEnrollments(this.currentClassName) // refresh enrollment list
              })                                  
    this.addStudentStatement = ''
  } 

  cancelAddStudent(){ this.addStudentStatement = '' }

}
