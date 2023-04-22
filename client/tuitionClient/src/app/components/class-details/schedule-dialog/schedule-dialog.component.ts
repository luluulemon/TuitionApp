import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClassService } from 'src/app/services/class.service';

@Component({
  selector: 'app-schedule-dialog',
  templateUrl: './schedule-dialog.component.html',
  styleUrls: ['./schedule-dialog.component.css']
})
export class ScheduleDialogComponent {
  constructor(public dialogRef: MatDialogRef<ScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: 
      { allSchedules: Date[], 
        currentClassName: string, 
        currentClassYear: number,
        addSchedule: boolean,
        editSchedule: boolean,
        schedule: any,
        scheduleOldDateTime: Date },  // schedule to edit
    private fb: FormBuilder, private datepipe: DatePipe, private classSvc: ClassService) {}


  scheduleForm!: FormGroup
  todaysDate: Date = new Date;  // for having min Date for schedule

  ngOnInit(){ 
    if(this.data.addSchedule) this.createAddForm() 
    else{ this.createEditForm() }
  }

  createAddForm(){             // form for add & edit schedule
    this.scheduleForm = this.fb.group({
      scheduleDate: this.fb.control('', Validators.required),
      hour: this.fb.control<number>(0, Validators.required),
      minute: this.fb.control<number>(0, Validators.required),
      repeat: this.fb.control<string>('No Repeat', Validators.required)
    })
  }

  createEditForm(){
    this.scheduleForm = this.fb.group({
      scheduleDate: this.fb.control(this.data.schedule, Validators.required),
      hour: this.fb.control<number>(this.data.schedule.getHours(), Validators.required),
      minute: this.fb.control<number>(this.data.schedule.getMinutes(), Validators.required),
    })
  }


  saveSchedule(){         
    console.info(this.scheduleForm.value)
    // try converting date
    let latest_date =this.datepipe.transform(this.scheduleForm.value.scheduleDate, 'yyyy-MM-dd');
    // create SQL datetime string
      // adding zero for single digits: for server DateTimeFormatter
      let hour = ''
      if(this.scheduleForm.value.hour<10){  hour = `0${this.scheduleForm.value.hour}` }
      else{ hour = this.scheduleForm.value.hour }

      let minute = ''
      if(this.scheduleForm.value.minute<10){  minute = `0${this.scheduleForm.value.minute}`}
      else{ minute = this.scheduleForm.value.minute }

    let datetime = `${latest_date} ${hour}:${minute}:00`
    console.info('check datetime entry: ',datetime)

    const clash: boolean = 
        this.classSvc.checkClashingSchedules(datetime, this.data.allSchedules)  // check clashing schedules
    if(clash){ 
      this.dialogRef.close('CLASH with other schedule')     
    }

    else{
    const schedule =
                  { className: this.data.currentClassName, 
                    classYear: this.data.currentClassYear, 
                    classDate: datetime,
                    repeat: this.scheduleForm.value.repeat,
                    schedules: this.data.allSchedules     // send to back end to check for repeat
                  }
    this.classSvc.addSchedule(schedule)
                .then(() => 
                  { this.dialogRef.close
                    (`Added schedule: ${ this.datepipe.transform(new Date(datetime), 'M/d/yy, h:mm a' )}`)
                  })
                .catch(error =>     // server checks for clash for repeat schedules
                  { console.error("error: ", error)
                    this.dialogRef.close('CLASH with other schedule')
                  } )
    }
  }


  updateSchedule(){ 
    let latest_date =this.datepipe.transform(this.scheduleForm.value.scheduleDate, 'yyyy-MM-dd');

    // adding zero for single digits: for server DateTimeFormatter
    let hour = ''
    if(this.scheduleForm.value.hour<10){  hour = `0${this.scheduleForm.value.hour}` }
    else{ hour = this.scheduleForm.value.hour }

    let minute = ''
    if(this.scheduleForm.value.minute<10){  minute = `0${this.scheduleForm.value.minute}`}
    else{ minute = this.scheduleForm.value.minute }


  let updateDateTime = { oldDateTime: this.data.scheduleOldDateTime, 
    newDateTime: `${latest_date} ${hour}:${minute}:00`}
  
  const clash: boolean = this.classSvc.checkClashingSchedules(updateDateTime.newDateTime, this.data.allSchedules)
    if(clash){  this.dialogRef.close('CLASH with other schedule')    }

    else{
    this.classSvc.updateSchedule(this.data.currentClassYear, this.data.currentClassName, updateDateTime)
                  .then(() => { 
                                this.dialogRef.close(
                                  `updated ${ this.datepipe.transform(new Date(this.data.scheduleOldDateTime), 'M/d/yy, h:mm a' )} 
                                    to ${ this.datepipe.transform( updateDateTime.newDateTime, 'M/d/yy, h:mm a' )}` )
                                // this.editSchedule = false
                                // this.openSnackBar()
                              })
    }
  }
}
