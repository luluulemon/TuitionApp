import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Class, ClassDetail, Schedule, Student, Teacher } from '../model';

@Injectable({
  providedIn: 'root'
})
export class ClassService {


  constructor(private http: HttpClient) { }

  getTeachers():Promise<Teacher[]>{
    console.info('called get Teachers Svc')
    return lastValueFrom( this.http.get<Teacher[]>('/api/class/getTeachers') )
  }

  addClass(newClass: Class): Promise<any>{
    console.info('called addClass')
    return lastValueFrom( this.http.post('/api/class/addClass', newClass))
  }

  getClasses(): Promise<Class[]>{
    return lastValueFrom( this.http.get<Class[]>('/api/class/getClasses'))
  }

  addSchedule(s: Schedule): Promise<any>{
    return lastValueFrom( this.http.post('/api/class/addSchedule', s))
  }

  getSchedules(className: string): Promise<Date[]>{
    return lastValueFrom(this.http.get<Date[]>(`/api/class/getSchedules/${className}`))
  }

  updateSchedule(schedules: any): any{
    return lastValueFrom( this.http.put('/api/class/updateSchedule', schedules))
  }

  deleteSchedule(s: Date): any{ 
    return lastValueFrom( this.http.get(`/api/class/deleteSchedule/${s}`))
}

  getStudents(): Promise<Student[]>{
    return lastValueFrom(this.http.get<Student[]>('/api/class/getStudents'))
  }

  searchStudents(searchString: string): Promise<Student[]>{
    // return all students if search is empty
    if(!searchString){  return lastValueFrom(this.http.get<Student[]>('/api/class/getStudents'))  }
    return lastValueFrom(this.http.get<Student[]>(`/api/class/searchStudents/${searchString}`))
  }


  getClassDetails(className: string): Promise<ClassDetail>{
    return lastValueFrom(this.http.get<ClassDetail>(`/api/class/classDetails/${className}`))
  }

  
}
