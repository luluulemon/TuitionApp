import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Class, Schedule, Student, Teacher } from '../model';

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

  getSchedules(className: string): Promise<string[]>{
    return lastValueFrom(this.http.get<string[]>(`/api/class/getSchedules/${className}`))
  }

  getStudents(): Promise<Student[]>{
    return lastValueFrom(this.http.get<Student[]>('/api/class/getStudents'))
  }

  searchStudents(searchString: string): Promise<Student[]>{
    return lastValueFrom(this.http.get<Student[]>(`/api/class/searchStudents/${searchString}`))
  }
}
