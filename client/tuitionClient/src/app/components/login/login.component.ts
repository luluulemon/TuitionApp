import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm!: FormGroup
  loginError: boolean = false;

  constructor(private fb: FormBuilder, private router: Router,
              private http: HttpClient){}

  ngOnInit(){
    this.createLoginForm()
  }

  createLoginForm(){
    this.loginForm = this.fb.group({
      email: this.fb.control<string>('', [Validators.required]),
      password: this.fb.control<string>('', [Validators.required]), 
    })
  }

  login(){
    console.info(this.loginForm.value)
    let loginObj = {  email: this.loginForm.value.email,
                      password: this.loginForm.value.password }

    lastValueFrom (this.http.post('api/auth/login', loginObj) )
                                  .then(() => this.router.navigate(['main']))
                                  .catch(error => {
                                    console.error(error)
                                    this.loginError = true;

                                  })
  }
}
