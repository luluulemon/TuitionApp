import { Component } from '@angular/core';
import { DatePipe } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Schedule, Student } from 'src/app/model';
import { ClassService } from 'src/app/services/class.service';


@Component({
  selector: 'app-class-details',
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.css']
})
export class ClassDetailsComponent {

  // Check for clashed schedules

  addSchedule: boolean = false;
  form!: FormGroup
  currentClass: string = '' // for storing className
  updateMsg: string = ''    // for storing add Schedule msg/error
  schedules: string[] = []
  todaysDate: Date = new Date;  // for having min Date for schedule



  constructor(private fb: FormBuilder, private datepipe: DatePipe,
            private activatedRoute: ActivatedRoute, private classSvc:ClassService){}

  ngOnInit(){
    console.info('Init called now')
    this.currentClass = this.activatedRoute.snapshot.params['className']
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

    const schedule: Schedule = {  className: this.currentClass, classDate: datetime }
    this.classSvc.addSchedule(schedule)
                .then(v => 
                  { 
                    this.getSchedules()
                    this.updateMsg =  v['Update Msg'] 
                    this.createForm()
                  })
    
  }

  getSchedules(){
    this.classSvc.getSchedules(this.currentClass)
                  .then(v => this.schedules = v)
  }


  studentSearchForm!: FormGroup
  addStudentForm!: FormGroup
  students: Student[] = []                  // for students tab -> add students
  studentsDisplay: Student[] = []
  columnsToDisplay = ['studentId', 'name', 'phoneNum', 'joinDate'];   // for students tab table
  offset: number = 0
  nextPageBoolean: boolean = false
  addStudentStatement: string = ''
  selectedStudent!: Student

  startStudentTab(){
    this.getStudents()
    this.createSearchForm()
    this.createAddStudentForm()
  }

  createSearchForm(){ 
    this.studentSearchForm = this.fb.group({ searchName: this.fb.control('') })
  }

  createAddStudentForm(){
    this.addStudentForm = this.fb.group({ startDate: this.fb.control<string>('', Validators.required)})
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
    this.addStudentStatement = `Adding ${s.name} to ${this.currentClass}: `
  }

  confirmAddStudent(){  
    let e = { phoneNum: this.selectedStudent.phoneNum,
              className: this.currentClass,
              expiryDate: this.addStudentForm.value.startDate  
            }
    console.info(e)
    this.classSvc.addEnrollment(e)
    this.addStudentStatement = ''
  } 

  cancelAddStudent(){ this.addStudentStatement = '' }

}
