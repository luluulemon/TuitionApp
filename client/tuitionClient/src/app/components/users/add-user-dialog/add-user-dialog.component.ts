import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent {

  constructor(private fb:FormBuilder,
              private userSvc: UserService,
              public dialogRef: MatDialogRef<AddUserDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: {
                  allAttendance: any[], 
                  attendanceColumnsToDisplay: string[] }
              ) {}

    
  addUserForm!: FormGroup;
  ErrorMsg: string = ''
  
  ngOnInit(){
    this.createForm()
  }

  createForm(){
    this.addUserForm = this.fb.group({
      name: this.fb.control<string>('', Validators.required),
      phoneNum: this.fb.control([Validators.required, Validators.pattern('[0-9]*')]),
      email: this.fb.control<string>('', [Validators.required, Validators.email]),
      type: this.fb.control<string>('', Validators.required)
    })
  }

  saveUser(){
    console.info(this.addUserForm.value)
    const newUser: User = this.addUserForm.value
    this.userSvc.addUser(newUser)
                  .then(v => {console.info(v)
                    this.dialogRef.close(v['Insert Msg'])
                  })
                  .catch(error => {console.info(error.error)
                    this.ErrorMsg = error.error['Insert Msg']
                  })
    this.createForm();
  }

}
