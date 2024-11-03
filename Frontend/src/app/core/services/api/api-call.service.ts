import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {

  baseUrl: string = "";

  constructor(private configService: ConfigService,
    private httpClient: HttpClient
  ) {
      this.baseUrl = this.configService.baseURL+'apis'
   }

  recentJobs(): any {
    return this.httpClient.get(`${this.baseUrl}/recent/`).pipe(map((res => res)))
  }

  getJobs(data: any): any {
    return this.httpClient.get(`${this.baseUrl}/search/`, {
			params: data
		}).pipe(map((res => res)))
  }

  getJobDetails(id: string): any {
    return this.httpClient.get(`${this.baseUrl}/jobs/${id}`).pipe(map((res => res)))
  }
}
