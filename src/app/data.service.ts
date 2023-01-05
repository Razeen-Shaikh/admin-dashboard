import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  base_url = 'https://geektrust.s3-ap-southeast-1.amazonaws.com';

  constructor(private http: HttpClient) {}

  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(
      `${this.base_url}/adminui-problem/members.json`
    );
  }
}
