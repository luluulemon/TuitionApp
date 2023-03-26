import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {

  form!: FormGroup
  newUserSelect: boolean = false
  insertMsg: string = ''

  constructor(private fb:FormBuilder, private userSvc: UserService,
              private msgSnackBar: MatSnackBar){}

  ngOnInit(){}

  newUser(){  
    this.newUserSelect = true;
    this.createForm()  }
  userUnselect(){ this.newUserSelect = false; }

  createForm(){
    this.form = this.fb.group({
      name: this.fb.control<string>('', Validators.required),
      phoneNum: this.fb.control([Validators.required, Validators.pattern('[0-9]*')]),
      email: this.fb.control<string>('', [Validators.required, Validators.email]),
      type: this.fb.control<string>('', Validators.required)
    })
  }

  saveUser(){
    console.info(this.form.value)
    const newUser: User = this.form.value
    this.userSvc.addUser(newUser)
                  .then(v => {console.info(v)
                    this.msgSnackBar.open( v['Insert Msg'], 'X', { duration: 7000 } )
                  })
    this.createForm();
  }
}
