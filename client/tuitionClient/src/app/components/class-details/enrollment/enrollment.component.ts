import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Student } from 'src/app/model';
import { ClassService } from 'src/app/services/class.service';
import { EnrolService } from 'src/app/services/enrol.service';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.css']
})
export class EnrollmentComponent {

  constructor(private fb:FormBuilder, private classSvc: ClassService
              , private enrolSvc: EnrolService, private activatedRoute: ActivatedRoute){}

  studentSearchForm!: FormGroup
  addStudentForm!: FormGroup
  students: Student[] = []            // for students tab -> add students
  studentsDisplay: Student[] = []     // students search table pagination (limit to 5)
  columnsToDisplay = ['studentId', 'name', 'phoneNum', 'joinDate'];   // for students tab table
  offset: number = 0
  nextPageBoolean: boolean = false
  addStudentStatement: string = ''
  selectedStudent!: Student
  currentClassName: string = ''

  ngOnInit(){
    this.createSearchForm()
    this.createAddStudentForm()
    this.currentClassName = this.activatedRoute.snapshot.params['className']
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
