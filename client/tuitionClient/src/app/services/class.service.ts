import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Class, ClassDetail, Enrollment, Schedule, Student, Teacher } from '../model';

@Injectable({
  providedIn: 'root'
})
export class ClassService {


  constructor(private http: HttpClient) { }
  
  enrollments: Enrollment[] = []

  getTeachers():Promise<Teacher[]>{
    console.info('called get Teachers Svc')
    return lastValueFrom( this.http.get<Teacher[]>('/api/class/getTeachers') )
  }

  addClass(newClass: Class): Promise<any>{
    console.info('called addClass')
    return lastValueFrom( this.http.post('/api/class/addClass', newClass))
  }

  getClasses(): Promise<any>{
    return lastValueFrom( this.http.get<any>('/api/class/getClasses'))
  }

  addSchedule(s: Schedule): Promise<any>{
    return lastValueFrom( this.http.post('/api/class/addSchedule', s))
  }

  getSchedules(classYear:number, className: string): Promise<Date[]>{
    return lastValueFrom(this.http.get<Date[]>(`/api/class/getSchedules/${classYear}/${className}`))
  }

  getRecentSchedules():any{
    return lastValueFrom(this.http.get('/api/class/getRecentSchedules'))
  }

  updateSchedule(classYear: number, className: string, schedules: any): any{
    return lastValueFrom( this.http.put(`/api/class/updateSchedule/${classYear}/${className}`, schedules))
  }

  deleteSchedule(classYear:number, className: string, s: Date): any{ 
    return lastValueFrom( this.http.get(`/api/class/deleteSchedule/${classYear}/${className}/${s}`))
  }

  checkClashingSchedules(newDateTime: string, schedules: Date[], updateIndex: number): boolean{
    // Checks for schedule one hour before and one hour after
    const clashArray: number[] = []
    let newSchedule = new Date(newDateTime)
    let newSchedulePlusOne = new Date( newSchedule.setHours(newSchedule.getHours() + 1) )
    let newScheduleMinusOne = new Date( newSchedule.setHours(newSchedule.getHours() - 2) )

    console.info('Check plus one: ', newSchedulePlusOne)
    console.info('Check minus one', newScheduleMinusOne) 

    for(let i=0; i<schedules.length; i++){
      if(new Date(schedules[i]) > newScheduleMinusOne && new Date(schedules[i]) < newSchedulePlusOne){
        if(i==updateIndex)
        { console.info('CLASH with ownself la')}
        else
        { clashArray.push(i)  
          console.info(new Date(schedules[i]))
          console.info(`index ${i} clash`)
          return true;
        }
      }
    }

    return false;
  }
  

  getStudents(): Promise<Student[]>{
    return lastValueFrom(this.http.get<Student[]>('/api/class/getStudents'))
  }

  searchStudents(searchString: string): Promise<Student[]>{
    // return all students if search is empty
    if(!searchString){  return lastValueFrom(this.http.get<Student[]>('/api/class/getStudents'))  }
    return lastValueFrom(this.http.get<Student[]>(`/api/class/searchStudents/${searchString}`))
  }


  getClassDetails(classYear:number, className: string): Promise<ClassDetail>{
    return lastValueFrom(this.http.get<ClassDetail>(`/api/class/classDetails/${classYear}/${className}`))
  }

  
}
