import { Component } from '@angular/core';
import { DatePipe } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Enrollment, Schedule, Student } from 'src/app/model';
import { ClassService } from 'src/app/services/class.service';
import { EnrolService } from 'src/app/services/enrol.service';


@Component({
  selector: 'app-class-details',
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.css']
})
export class ClassDetailsComponent {

  // Check for clashed schedules

  addSchedule: boolean = false;
  form!: FormGroup
  currentClassName: string = '' // for storing className
  updateMsg: string = ''    // for storing add Schedule msg/error
  schedules: string[] = []      // store schedules of currentClass
  todaysDate: Date = new Date;  // for having min Date for schedule



  constructor(private fb: FormBuilder, private datepipe: DatePipe,
            private activatedRoute: ActivatedRoute, private classSvc:ClassService,
            private enrolSvc: EnrolService ){}

  ngOnInit(){
    console.info('Init called now')
    this.currentClassName = this.activatedRoute.snapshot.params['className']
    this.getSchedules()
    this.createSearchForm()
  }

  openAddSchedule(){  
    this.addSchedule = true
    this.createForm()       // reset form
    this.updateMsg = ''     // reset updateMsg
   }
  closeAddSchedule(){ this.addSchedule = false  }

  createForm(){
    this.form = this.fb.group({
      scheduleDate: this.fb.control('', Validators.required),
      hour: this.fb.control<number>(0, Validators.required),
      minute: this.fb.control<number>(0, Validators.required),
      repeat: this.fb.control<string>('No Repeat', Validators.required)
    })
  }

  saveSchedule(){
    console.info(this.form.value)
    // try converting date
    let latest_date =this.datepipe.transform(this.form.value.scheduleDate, 'yyyy-MM-dd');
    // create SQL datetime string
    let datetime = `${latest_date} ${this.form.value.hour}:${this.form.value.minute}:00`
    console.info('check datetime entry: ',datetime)

    const schedule: Schedule = {  className: this.currentClassName, classDate: datetime }
    this.classSvc.addSchedule(schedule)
                .then(v => 
                  { 
                    this.getSchedules()
                    this.updateMsg =  v['Update Msg'] 
                    this.createForm()
                  })
    
  }

  getSchedules(){
    this.classSvc.getSchedules(this.currentClassName)
                  .then(v => this.schedules = v)
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
    this.getEnrollments()
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
