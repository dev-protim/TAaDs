import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../core/component/header/header.component';
import { JobCardComponent } from '../../../core/component/job-card/job-card.component';
import { ApiCallService } from '../../../core/services/api/api-call.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SubSink } from 'subsink';
import { Job } from '../../../core/models/job'
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [HeaderComponent, JobCardComponent, CommonModule, NgxPaginationModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
  providers: [ApiCallService]
})
export class HomepageComponent implements OnInit {

  subs = new SubSink();
  latestJobs$: Job[] = [];
  latestJob: any;
  allJobs: any[] = [];
  totalJobs: any;
  jobType: string = "Latest ";
  jobResult: any;
  isJobResult: boolean = false;
  currentPage: number = 1;

  constructor(public apiService: ApiCallService,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.getRecentJobs();
      
  }

  getRecentJobs(): any {
    // this.latestJobs$ = this.apiService.recentJobs();
    this.subs.sink = this.apiService.recentJobs().subscribe((response: any) => {
      this.latestJob = response;
      this.totalJobs = this.latestJob.total_jobs;
      this.allJobs = this.latestJob.jobs;
      // console.log(response);
    });
  }

  getSearchResult(data: any): void {
    this.isJobResult = true;
    this.jobResult = data;
    this.totalJobs = this.jobResult.total_jobs;
    // this.totalJobs = data.total_jobs;
    this.allJobs = data.jobs;
    // this.jobType = "All ";
    console.log(this.jobResult, 'this.jobResult')
    this.jobType = "All "
  }

  pageChanged(event: any): void {
    console.log(event)
    this.currentPage = event;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
