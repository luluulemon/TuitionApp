import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-change-pw-dialog',
  templateUrl: './change-pw-dialog.component.html',
  styleUrls: ['./change-pw-dialog.component.css']
})
export class ChangePwDialogComponent {

  constructor(private fb:FormBuilder, private http:HttpClient,
              private snackbar: MatSnackBar, private router:Router){}

  changePwForm!: FormGroup
  changePwError: boolean = false;
  ErrorMsg: string = ''

  ngOnInit(){ this.createPwForm() }

  createPwForm(){
    this.changePwForm = this.fb.group({
      email: this.fb.control(''),
      password: this.fb.control<string>('', Validators.required),
      newPassword: this.fb.control<string>('', Validators.required),
      repeatNewPassword: this.fb.control<string>('', Validators.required)
    })
  }

  changePw(){
    const password = this.changePwForm.value
    const emailJSON = localStorage.getItem("currentUser")
    if(emailJSON)
    {  password.email = JSON.parse(emailJSON)    }

    if(password.newPassword!=password.repeatNewPassword){ this.ErrorMsg = 'New passwords do not match' }
    else{
      lastValueFrom( this.http.put('/api/auth/changePw', password)  )
        .then((v:any) => {
            this.snackbar.open( v.msg, 'X') 
            this.router.navigate(['main'])
          })
        .catch((error:any) => this.ErrorMsg = error.error.msg)
    }
  }

  
}
