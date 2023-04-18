import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-dad-joke',
  templateUrl: './dad-joke.component.html',
  styleUrls: ['./dad-joke.component.css']
})
export class DadJokeComponent {

  constructor(private http: HttpClient){}
  dadJokeOfTheDay: any = {}

  ngOnInit(){
    lastValueFrom( this.http.get('/api/jokes/getJoke'))
                          .then(joke => this.dadJokeOfTheDay = joke)
  }
}
