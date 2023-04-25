import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/model';
import { UserService } from 'src/app/services/user.service';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {

  userSearchForm!: FormGroup
  usersTable: any[] = []
  columnsToDisplay = ['name', 'type', 'phoneNum', 'email']
  // newUserSelect: boolean = false
  errorMsg: string = ''

  constructor(private fb:FormBuilder, private userSvc: UserService,
              private msgSnackBar: MatSnackBar, private dialog:MatDialog,
              private router: Router){}

  ngOnInit(){
    this.createSearchForm()
  }


  newUser(){
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
        width: '400px'
      })

    dialogRef.afterClosed().subscribe((msg) => {
      console.info(msg)
      if(msg)
        this.msgSnackBar.open( msg, 'X', { duration: 7000 } )
    })
  }

  createSearchForm(){
    this.userSearchForm = this.fb.group({
      searchName: this.fb.control<string>('')
    })
  }

  searchUsers(){
    console.info(this.userSearchForm.value)
    this.userSvc.searchUser(this.userSearchForm.value.searchName)
                          .then(v => {
                            console.info(v)
                            this.usersTable = v
                          })
                          .catch(error => {
                            if(error.status==404)
                            this.errorMsg = 'No user found' })
  }

  displayUser(user: any){ 
    console.info(user)
    if(user.type=='student')
    { this.router.navigate(['/students', user.phoneNum]) }
    if(user.type=='admin')
    { }
    else
    { this.router.navigate(['teachers', user.phoneNum])}
  }
 
  // saveUser(){
  //   console.info(this.form.value)
  //   const newUser: User = this.form.value
  //   this.userSvc.addUser(newUser)
  //                 .then(v => {console.info(v)
  //                   this.msgSnackBar.open( v['Insert Msg'], 'X', { duration: 7000 } )
  //                 })
  //   this.createForm();
  // }
}
