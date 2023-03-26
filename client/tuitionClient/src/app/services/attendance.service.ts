import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Class, Enrollment, Schedule, Student, Teacher } from '../model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

    constructor(private http: HttpClient){}

    markAttendance(attendanceObj: any):any{
        return lastValueFrom( this.http.post('api/attendance/add', attendanceObj))
    }

    getAttendance(classYear:number, className: string, schedule: string): Promise<Enrollment[]>{
        return lastValueFrom( this.http.get<Enrollment[]>(`api/attendance/get/${classYear}/${className}/${schedule}`))
    }


}