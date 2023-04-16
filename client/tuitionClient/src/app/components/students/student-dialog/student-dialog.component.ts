import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
                @Inject(MAT_DIALOG_DATA) public data: {selectedStudent: Student, editDetails: boolean },
              private studentSvc:StudentService,
              private fb:FormBuilder ) {}

  @ViewChild('uploadFile')
  imageFile!: ElementRef

  uploadPic(){    // upload new/edit pic
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

  // For student details edit dialog from here
  studentDetailsForm!: FormGroup    // for edit details form

  ngOnInit(){
    this.createStudentDetailsForm()
  }

  createStudentDetailsForm(){     // edit details form
    this.studentDetailsForm = this.fb.group({
      phoneNum: this.fb.control<number>(this.data.selectedStudent.phoneNum, [Validators.required]),
      email: this.fb.control<string>(this.data.selectedStudent.email, [Validators.required, Validators.email]),
      joinDate: this.fb.control(''),
      notes: this.fb.control<string>(this.data.selectedStudent.notes)
    })
  }

  saveEditDetails(){
    let newDetails = {  
      name: this.data.selectedStudent.name,
      phoneNum: this.studentDetailsForm.value.phoneNum,
      email: this.studentDetailsForm.value.email,
      notes: this.studentDetailsForm.value.notes,
      phoneNumChanged: this.studentDetailsForm.value.phoneNum!=this.data.selectedStudent.phoneNum,
      emailChanged: this.studentDetailsForm.value.email != this.data.selectedStudent.email,
      notesChanged: this.studentDetailsForm.value.notes != this.data.selectedStudent.notes
    }
    console.info(newDetails)

    // 1. no change
    if(newDetails.phoneNum==this.data.selectedStudent.phoneNum &&
      newDetails.email==this.data.selectedStudent.email &&
      newDetails.notes == this.data.selectedStudent.notes)
      { console.info('no change');  
        this.dialogRef.close()
      }

    // 2. changes
    else{ //if(newDetails.phoneNum!=this.data.selectedStudent.phoneNum){
      this.studentSvc.saveEditDetails(this.data.selectedStudent.phoneNum ,newDetails)
                      .then(() => this.dialogRef.close(newDetails.phoneNum))
    }  

    // // 3. email & notes
    // else 
    // { console.info('update notes only')
    //   this.studentSvc.saveEditNotes(this.data.selectedStudent.phoneNum, newDetails.notes)
    // }
  }



}



