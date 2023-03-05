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
import { DatePipe } from '@angular/common'

const appRoutes:Routes = [
  { path: '', component: MainComponent  },
  { path: 'classes', component: ClassesComponent},
  { path: 'students', component: StudentsComponent },
  { path: 'classDetails/:className', component: ClassDetailsComponent },
  { path: 'users', component: UsersComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ClassesComponent,
    StudentsComponent,
    ClassDetailsComponent,
    UsersComponent
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
