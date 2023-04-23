import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { ClassesComponent } from './components/classes/classes.component';

import { Routes, RouterModule } from '@angular/router';
import { StudentsComponent } from './components/students/students.component'
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ClassDetailsComponent } from './components/class-details/class-details.component';
import { UsersComponent } from './components/users/users.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MaterialModule } from './material';
import { DatePipe } from '@angular/common';
import { AttendanceComponent } from './components/class-details/attendance/attendance.component';
import { EnrollmentComponent } from './components/class-details/enrollment/enrollment.component';
import { AttendanceDialogComponent } from './components/class-details/attendance-dialog/attendance-dialog.component';
import { StudentDialogComponent } from './components/students/student-dialog/student-dialog.component';
import { DadJokeComponent } from './components/dad-joke/dad-joke.component';
import { AddUserDialogComponent } from './components/users/add-user-dialog/add-user-dialog.component';
import { LoginComponent } from './components/login/login.component';
import { ScheduleDialogComponent } from './components/class-details/schedule-dialog/schedule-dialog.component';
import { TeachersComponent } from './components/users/teachers/teachers.component';
import { TeacherDialogComponent } from './components/users/teachers/teacher-dialog/teacher-dialog.component';
import { ChangePwDialogComponent } from './components/change-pw-dialog/change-pw-dialog.component';


const appRoutes:Routes = [
  { path: '', component:LoginComponent},
  { path: 'main', component: MainComponent  },
  { path: 'main/:email', component: MainComponent },
  { path: 'classes', component: ClassesComponent},
  { path: 'students/:phoneNum/:className/:classYear', component: StudentsComponent },
  { path: 'students/:phoneNum', component: StudentsComponent},
  { path: 'teachers/:phoneNum', component: TeachersComponent  },
  { path: 'classDetails/:className/:classYear', component: ClassDetailsComponent },
  { path: 'attendance/:className/:classYear/:schedule', component: AttendanceComponent },
  { path: 'enrollment/:className/:classYear', component: EnrollmentComponent},
  { path: 'users', component: UsersComponent },
  { path: 'password', component: ChangePwDialogComponent },
  { path: 'jokes', component: DadJokeComponent  },
  { path: '**', redirectTo: '/', pathMatch: 'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ClassesComponent,
    StudentsComponent,
    ClassDetailsComponent,
    UsersComponent,
    AttendanceComponent,
    EnrollmentComponent,
    AttendanceDialogComponent,
    StudentDialogComponent,
    DadJokeComponent,
    AddUserDialogComponent,
    LoginComponent,
    ScheduleDialogComponent,
    TeachersComponent,
    TeacherDialogComponent,
    ChangePwDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes, {useHash: true}),
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
