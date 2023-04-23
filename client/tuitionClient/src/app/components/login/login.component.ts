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
    let loginObj = {  email: this.loginForm.value.email,
                      password: this.loginForm.value.password }

    lastValueFrom (this.http.post('api/auth/login', loginObj) )
                                  .then(() => {     // set current user in localStorage
                                    const JSONstring = JSON.stringify(this.loginForm.value.email)
                                    localStorage.setItem("currentUser", JSONstring)
                                    this.router.navigate(['main', this.loginForm.value.email])
                                  })
                                  .catch(error => {
                                    console.error(error)
                                    this.loginError = true;
                                  })
  }
}
