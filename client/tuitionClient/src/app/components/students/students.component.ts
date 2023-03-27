import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent {

  constructor(private activatedRoute:ActivatedRoute, private studentSvc: StudentService){}

  selectedStudentNum: number = 0

  ngOnInit(){
    this.selectedStudentNum = this.activatedRoute.snapshot.params['phoneNum']
    this.getStudentDetails(this.selectedStudentNum)
  }

  getStudentDetails(phoneNum: number){
    this.studentSvc.getStudentDetails(phoneNum)
                    .then((v: any) => console.info(v))
  }
}
