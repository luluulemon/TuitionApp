import { Component, ElementRef, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Enrollment, Student } from 'src/app/model';
import { EnrolService } from 'src/app/services/enrol.service';
import { StudentService } from 'src/app/services/student.service';
import { StudentDialogComponent } from './student-dialog/student-dialog.component';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent {

  constructor(private activatedRoute:ActivatedRoute, 
              private studentSvc: StudentService,
              private enrolSvc: EnrolService,
              private fb:FormBuilder, private dialog: MatDialog){}

  selectedStudentNum: number = 0
  currentClassName: string = ''
  currentClassYear: number = 0
  student!: Student
  profilePicForm!: FormGroup
  // todaysDate: Date = new Date;  // for displaying extend button
  
  @ViewChild('uploadFile')
  imageFile!: ElementRef



  ngOnInit(){
    this.selectedStudentNum = this.activatedRoute.snapshot.params['phoneNum']
    this.currentClassName = this.activatedRoute.snapshot.params['className']
    this.currentClassYear = this.activatedRoute.snapshot.params['classYear']
    this.getStudentDetails(this.selectedStudentNum)
    this.createProfilePicForm()
  }

  createProfilePicForm(){
    this.profilePicForm = this.fb.group({
      'image-file': this.fb.control('')
    })
  }

  getStudentDetails(phoneNum: number){
    this.studentSvc.getStudentDetails(phoneNum)
                    .then((v: any) => {
                      this.student = v
                      console.info(v)
                    })
  }

  extendEnrollment(enrollment: Enrollment){
    console.info(enrollment)
    this.enrolSvc.extendEnrollment(enrollment)
                  .then(() => this.getStudentDetails(this.selectedStudentNum))
  }

  addProfilePic(){
    const formData = new FormData()
    formData.set('image', this.imageFile.nativeElement.files[0])
    this.studentSvc.addProfilePic(this.selectedStudentNum, formData)
                        .then(()=> this.getStudentDetails(this.selectedStudentNum))
  }

  uploadPic(){
    // const formData = new FormData()
    // formData.set('image', this.imageFile.nativeElement.files[0])

    const dialogRef = this.dialog.open(StudentDialogComponent, { 
        data: { selectedStudent: this.student },
        width: '500px'
      })

    dialogRef.afterClosed().subscribe(result => {
        console.info('Check subscription')
        this.getStudentDetails(this.selectedStudentNum)
      })

  }

  editStudentDetails(){

    const dialogRef = this.dialog.open(StudentDialogComponent, {
      data: { selectedStudent: this.student, editDetails: true },
      width: '350px'
    })

    // update student details after dialog close
    dialogRef.afterClosed().subscribe((phoneNum) => {
      this.getStudentDetails(phoneNum)
    })
  }

}
