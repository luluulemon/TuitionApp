import { Component } from '@angular/core';
import { DatePipe } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Schedule } from 'src/app/model';
import { ClassService } from 'src/app/services/class.service';


@Component({
  selector: 'app-class-details',
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.css']
})
export class ClassDetailsComponent {

  // Check for clashed schedules

  addSchedule: boolean = false;
  form!: FormGroup
  currentClass: string = '' // for storing className
  updateMsg: string = ''    // for storing add Schedule msg/error
  schedules: string[] = []
  todaysDate: Date = new Date;

  constructor(private fb: FormBuilder, private datepipe: DatePipe,
            private activatedRoute: ActivatedRoute, private classSvc:ClassService){}

  ngOnInit(){
    console.info('Init called now')
    this.currentClass = this.activatedRoute.snapshot.params['className']
    this.getSchedules()
  }

  openAddSchedule(){  
    this.addSchedule = true
    this.createForm()       // reset form
    this.updateMsg = ''     // reset updateMsg
   }
  closeAddSchedule(){ this.addSchedule = false  }

  createForm(){
    this.form = this.fb.group({
      scheduleDate: this.fb.control('', Validators.required),
      hour: this.fb.control<number>(0, Validators.required),
      minute: this.fb.control<number>(0, Validators.required),
      repeat: this.fb.control<string>('No Repeat', Validators.required)
    })
  }

  saveSchedule(){
    console.info(this.form.value)
    // try converting date
    let latest_date =this.datepipe.transform(this.form.value.scheduleDate, 'yyyy-MM-dd');
    // create SQL datetime string
    let datetime = `${latest_date} ${this.form.value.hour}:${this.form.value.minute}:00`
    console.info('check datetime entry: ',datetime)

    const schedule: Schedule = {  className: this.currentClass, classDate: datetime }
    this.classSvc.addSchedule(schedule)
                .then(v => 
                  { 
                    this.getSchedules()
                    this.updateMsg =  v['Update Msg'] 
                    this.createForm()
                  })
    
  }

  getSchedules(){
    this.classSvc.getSchedules(this.currentClass)
                  .then(v => this.schedules = v)
  }

}
