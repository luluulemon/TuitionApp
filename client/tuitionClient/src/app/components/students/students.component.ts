import { Component, ElementRef, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Enrollment, Student } from 'src/app/model';
import { EnrolService } from 'src/app/services/enrol.service';
import { StudentService } from 'src/app/services/student.service';
import { StudentDialogComponent } from './student-dialog/student-dialog.component';
import { TeacherService } from 'src/app/services/teacher.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent {

  constructor(private activatedRoute:ActivatedRoute, 
              private studentSvc: StudentService,
              private enrolSvc: EnrolService,
              private fb:FormBuilder, private dialog: MatDialog,
              private teacherSvc: TeacherService){}

  selectedStudentNum: number = 0
  currentClassName: string = ''
  currentClassYear: number = 0
  student!: Student


  @ViewChild('uploadFile')
  imageFile!: ElementRef


  ngOnInit(){
    this.selectedStudentNum = this.activatedRoute.snapshot.params['phoneNum']
    this.currentClassName = this.activatedRoute.snapshot.params['className']
    this.currentClassYear = this.activatedRoute.snapshot.params['classYear']
    // this.userType = this.activatedRoute.snapshot.params['type']
    // if(this.userType=='teacher'){  console.info('teacher')   
    //   this.getTeacherDetails(this.selectedStudentNum)
    // }
    this.getStudentDetails(this.selectedStudentNum)  
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


  uploadPic(){
    const dialogRef = this.dialog.open(StudentDialogComponent, { 
        data: { selectedStudent: this.student   },
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
      console.info(phoneNum)
      if(phoneNum!=0)
        this.getStudentDetails(phoneNum)
    })
  }

}
