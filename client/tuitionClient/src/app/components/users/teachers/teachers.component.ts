import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeacherService } from 'src/app/services/teacher.service';
import { TeacherDialogComponent } from './teacher-dialog/teacher-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent {

  constructor(private teacherSvc:TeacherService, 
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog){}

  currentClassName: string = ''
  currentClassYear: number = 0
  selectedTeacherNum: number = 0
  teacher: any

  ngOnInit(){
    this.selectedTeacherNum = this.activatedRoute.snapshot.params['phoneNum']
    this.getTeacherDetails(this.selectedTeacherNum)
  }

  getTeacherDetails(phoneNum: number){
    this.teacherSvc.getTeacherDetails(phoneNum)
                    .then(v => {
                      this.teacher = v
                      console.info(v)
                    })
  }

  uploadPic(){
    const dialogRef = this.dialog.open(TeacherDialogComponent, { 
      data: { selectedTeacher: this.teacher, 
              
            },
      width: '500px'
    })

    dialogRef.afterClosed().subscribe(result => {
      if(result)
      { this.getTeacherDetails(this.selectedTeacherNum) }
    })
  }

  editTeacherDetails(){
    const dialogRef = this.dialog.open(TeacherDialogComponent, {
      data: { selectedTeacher: this.teacher, editDetails: true },
      width: '350px'
    })

    // update student details after dialog close
    dialogRef.afterClosed().subscribe((phoneNum) => {
      console.info(phoneNum)
      if(phoneNum!=0)
        this.getTeacherDetails(phoneNum)
    })
  }
}
