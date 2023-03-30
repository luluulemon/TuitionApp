import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Enrollment, Student } from 'src/app/model';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent {

  constructor(private activatedRoute:ActivatedRoute, private studentSvc: StudentService){}

  selectedStudentNum: number = 0
  currentClassName: string = ''
  currentClassYear: number = 0
  student!: Student

  ngOnInit(){
    this.selectedStudentNum = this.activatedRoute.snapshot.params['phoneNum']
    this.currentClassName = this.activatedRoute.snapshot.params['className']
    this.currentClassYear = this.activatedRoute.snapshot.params['classYear']
    this.getStudentDetails(this.selectedStudentNum)
  }

  getStudentDetails(phoneNum: number){
    this.studentSvc.getStudentDetails(phoneNum)
                    .then((v: any) => this.student = v)
  }

  extendEnrollment(enrol: Enrollment){
    console.info(enrol)
  }
}
