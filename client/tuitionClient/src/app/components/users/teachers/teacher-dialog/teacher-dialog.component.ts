import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TeacherService } from 'src/app/services/teacher.service';

@Component({
  selector: 'app-teacher-dialog',
  templateUrl: './teacher-dialog.component.html',
  styleUrls: ['./teacher-dialog.component.css']
})
export class TeacherDialogComponent {

  constructor(public dialogRef: MatDialogRef<TeacherDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {selectedTeacher: any, 
                                            editDetails: boolean,  
                                          },
  private teacherSvc:TeacherService,
  private fb:FormBuilder ) {}

  @ViewChild('uploadFile')
  imageFile!: ElementRef

  // uploadPic portion ---> edit details portion below
  uploadPic(){
    const formData = new FormData()
    formData.set('image', this.imageFile.nativeElement.files[0])

    // use the old Key to delete the old Pic - if any
    let oldKeyLength = this.data.selectedTeacher.profilePic.length
    if(this.data.selectedTeacher.profilePic!='NA'){
      formData.set('oldKey', this.data.selectedTeacher.profilePic.substring(oldKeyLength-8))
    }
    else{ formData.set('oldKey', 'NA' ) }

    this.teacherSvc.addProfilePic(this.data.selectedTeacher.phoneNum, formData)
                      .then(()=> {
                        this.dialogRef.close('Changed pic')
                        console.info('Changed pic')
                      })
  }


  // For teacher details edit dialog from here
  teacherDetailsForm!: FormGroup   

  ngOnInit(){
    this.createTeacherDetailsForm()
  }

  createTeacherDetailsForm(){     // edit details form
    this.teacherDetailsForm = this.fb.group({
      phoneNum: this.fb.control<number>(this.data.selectedTeacher.phoneNum, [Validators.required]),
      email: this.fb.control<string>(this.data.selectedTeacher.email, [Validators.required, Validators.email])
    })
  }


  saveEditDetails(){
    let newDetails = {  
      name: this.data.selectedTeacher.name,
      phoneNum: this.teacherDetailsForm.value.phoneNum,
      email: this.teacherDetailsForm.value.email,
      phoneNumChanged: this.teacherDetailsForm.value.phoneNum!=this.data.selectedTeacher.phoneNum,
      emailChanged: this.teacherDetailsForm.value.email != this.data.selectedTeacher.email,

    }
    console.info('Check newDetails: ', newDetails)

    // 1. no change
    if(!newDetails.phoneNumChanged &&
       !newDetails.emailChanged)
      { console.info('no change');  
        this.dialogRef.close(0)
      }

    // 2. changes
    else{ 
      this.teacherSvc.saveEditDetails(this.data.selectedTeacher.phoneNum ,newDetails)
                      .then(() => this.dialogRef.close(newDetails.phoneNum))
    }  
  }


}
