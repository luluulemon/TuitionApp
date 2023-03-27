import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Class, Enrollment, Schedule, Student, Teacher } from '../model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

    constructor(private http: HttpClient){}

    getStudentDetails(phoneNum: number):any{
        return lastValueFrom( this.http.get(`api/student/details/${phoneNum}`))
    }


}