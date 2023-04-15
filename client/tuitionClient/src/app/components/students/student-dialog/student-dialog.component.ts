import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Student } from 'src/app/model';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrls: ['./student-dialog.component.css']
})
export class StudentDialogComponent {

  constructor(public dialogRef: MatDialogRef<StudentDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: {selectedStudent: Student},
              private studentSvc:StudentService ) {}

  @ViewChild('uploadFile')
  imageFile!: ElementRef

  uploadPic(){
    const formData = new FormData()
    formData.set('image', this.imageFile.nativeElement.files[0])

    // use the old Key to delete the old Pic - if any
    let oldKeyLength = this.data.selectedStudent.profilePic.length
    if(this.data.selectedStudent.profilePic!='NA'){
      formData.set('oldKey', this.data.selectedStudent.profilePic.substring(oldKeyLength-8))
    }
    else{ formData.set('oldKey', 'NA' ) }


    this.studentSvc.addProfilePic(this.data.selectedStudent.phoneNum, formData)
                      .then(()=> {
                        this.dialogRef.close()
                        console.info('Changed pic')
                      })
    
  }
}



