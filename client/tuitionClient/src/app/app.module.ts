import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { ClassesComponent } from './components/classes/classes.component';

import { Routes, RouterModule } from '@angular/router';
import { StudentsComponent } from './components/students/students.component'
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

const appRoutes:Routes = [
  { path: '', component: MainComponent  },
  { path: 'classes', component: ClassesComponent},
  { path: 'students', component: StudentsComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ClassesComponent,
    StudentsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes, {useHash: true}),
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
