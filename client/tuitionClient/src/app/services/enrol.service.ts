import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { Enrollment, Student } from "../model";

@Injectable({
    providedIn: 'root'
})

export class EnrolService {

    constructor(private http: HttpClient){}

    addEnrollment(enrolJson: any){
        return lastValueFrom( this.http.post('api/enrol/newEnrollment', enrolJson))
    }

    getEnrollments(classYear:number, className: string): Promise<Enrollment[]>{
        const requestParams: HttpParams = new HttpParams()
            .set("className", className)
            .set("classYear", classYear)
        console.info('inside getEnrol svc: ', className)

        return lastValueFrom( 
            this.http.get<Enrollment[]>(`api/enrol/getEnrollments`, { params: requestParams }))
    }

}  