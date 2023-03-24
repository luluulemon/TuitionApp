import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Class, Teacher } from 'src/app/model';
import { ClassService } from 'src/app/services/class.service';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent {

  form!: FormGroup
  classYearForm!: FormGroup
  selectedClassYear: number = new Date().getFullYear()
  classes: Class[] = []
  classYears: number[] = []
  tForm: boolean = false
  teachers: Teacher[] = []

  constructor(private classSvc:ClassService, private fb:FormBuilder,
              private msgSnackBar:MatSnackBar){}
  
  ngOnInit(){
    this.createClassYearForm()  // for selecting class Year

    this.classYearForm.controls['classYear'].valueChanges.subscribe(val => 
      { // subscribe to class Year selection
        this.selectedClassYear = val  
        console.info('check change in year: ', this.selectedClassYear)
      } )
    this.classSvc.getTeachers()
                  .then( v => this.teachers = v )
                  .catch( error => console.error('get teachers error :', error))

    this.getClasses()
  }



  createClassYearForm(){
    this.classYearForm = this.fb.group ({ 
      classYear: this.fb.control<number>( new Date().getFullYear(), Validators.required) } )
  }

  createAddClassForm(){
    this.form = this.fb.group({
      className: this.fb.control<string>('', Validators.required),
      teacherId: this.fb.control<string>('', Validators.required),
      classYear: this.fb.control<string>('', Validators.required),
      description: this.fb.control<string>('')
    })
  }

  addClassForm(){  this.tForm = true
                this.createAddClassForm()  }
  closeClassForm(){ 
    this.tForm = false;
    //this.createTForm()
  }

  getClasses(){
    this.classSvc.getClasses()
    .then( v => {   this.classes = v.classArray
                    this.classYears = v.classYearArray
                })
    .catch( error => console.error('get classes error: ', error))
  }

  addClass(){   // get teacherId from index
    this.form.value.teacherId = this.teachers[this.form.value.teacherId].teacherId
    const newClass: Class = this.form.value

    if( this.classes.find( (Class) => Class.className == newClass.className) )
    { this.msgSnackBar.open(`Duplicate class: ${newClass.className} already exists`, 'X', { duration: 7000})}

    else{
      this.classSvc.addClass(newClass)
                .then(() => 
                      { this.getClasses() 
                        this.msgSnackBar.open(`Added class ${newClass.className}`, 'X', { duration: 7000})
                        this.closeClassForm()
                      })
    }
  }


  
}
