import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

    addProfilePic(phoneNum: number, pic: FormData):any{
      return lastValueFrom( this.http.post(`api/student/uploadPic/${phoneNum}`, pic))
    }


    saveEditDetails(oldPhoneNum:number, newDetails: any):any{
      return lastValueFrom( this.http.put(`api/student/editDetails/${oldPhoneNum}`, newDetails))
    }

    // saveEditNotes(phoneNum:number, notes:string){
    //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    //   const requestParams: HttpParams = new HttpParams()
    //                         .set('notes', notes)

    //   //const body = { 'notes': notes}

    //   lastValueFrom( this.http.get(`api/student/editNotes/${phoneNum}`, { headers:headers, params: requestParams} ))
    // }

}