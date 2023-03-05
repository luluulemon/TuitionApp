import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { User } from "../model";

@Injectable({
    providedIn: 'root'
  })

export class UserService{

    constructor(private http:HttpClient){}

    addUser(newUser: User):Promise<any>{
        return lastValueFrom( this.http.post('/api/user/addUser', newUser))
    }
}