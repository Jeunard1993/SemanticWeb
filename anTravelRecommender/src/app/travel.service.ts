import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TravelService {

  constructor(private http: HttpClient) { }

  getResponse$(request:any):Observable<any> {
    return this.http.post<any>(`api/results`, request);
  }
}
