import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Class, Teacher } from '../model';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  constructor(private http: HttpClient) { }

  getTeachers():Promise<Teacher[]>{
    console.info('called get Teachers Svc')
    return lastValueFrom( this.http.get<Teacher[]>('getTeachers') )
  }

  addClass(newClass: Class){
    lastValueFrom( this.http.post('addClass', newClass))
  }

  getClasses(): Promise<Class[]>{
    return lastValueFrom( this.http.get<Class[]>('/getClasses'))
  }
}
