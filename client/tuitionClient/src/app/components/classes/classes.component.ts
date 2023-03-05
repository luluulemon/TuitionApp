import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Class, Teacher } from 'src/app/model';
import { ClassService } from 'src/app/services/class.service';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent {

  form!: FormGroup
  classes: Class[] = []
  tForm: boolean = false
  teachers: Teacher[] = []

  constructor(private classSvc:ClassService, private fb:FormBuilder){}
  
  ngOnInit(){
    this.createTForm()
    this.classSvc.getTeachers()
                  .then( v => this.teachers = v )
                  .catch( error => console.error('get teachers error :', error))

    this.getClasses()
  }

  createTForm(){
    this.form = this.fb.group({
      className: this.fb.control<string>('', Validators.required),
      teacherId: this.fb.control<string>('', Validators.required),
      description: this.fb.control<string>('')
    })
  }

  addTForm(){  this.tForm = true  }
  closeTForm(){ 
    this.tForm = false;
    this.createTForm()
  }

  getClasses(){
    this.classSvc.getClasses()
    .then( v => {   this.classes = v    })
    .catch( error => console.error('get classes error: ', error))
  }

  addClass(){   // get teacherId from index
    this.form.value.teacherId = this.teachers[this.form.value.teacherId].teacherId
    const newClass: Class = this.form.value
    this.classSvc.addClass(newClass)
              .then(v =>  this.getClasses() )
  }
  
}
