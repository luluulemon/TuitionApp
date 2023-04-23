import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { User } from "../model";

@Injectable({
    providedIn: 'root'
  })

export class TeacherService{

    constructor(private http:HttpClient){}

    getTeacherDetails(phoneNum: number):Promise<any>{
        return lastValueFrom( this.http.get(`/api/teacher/details/${phoneNum}`))
    }

    addProfilePic(phoneNum: number, pic: FormData):any{
        return lastValueFrom( this.http.post(`api/teacher/uploadPic/${phoneNum}`, pic))
    }

    saveEditDetails(oldPhoneNum:number, newDetails: any):any{
        return lastValueFrom( this.http.put(`api/teacher/editDetails/${oldPhoneNum}`, newDetails))
    }

}