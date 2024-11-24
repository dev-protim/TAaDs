import { Component, OnInit, HostListener } from '@angular/core';
import { HeaderComponent } from '../../../core/component/header/header.component';
import { JobCardComponent } from '../../../core/component/job-card/job-card.component';
import { ApiCallService } from '../../../core/services/api/api-call.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SubSink } from 'subsink';
import { Job } from '../../../core/models/job';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [HeaderComponent, JobCardComponent, CommonModule, NgxPaginationModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
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
  isLoading: boolean = false;

  constructor(public apiService: ApiCallService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getRecentJobs();
    this.adjustLoaderSize();
  }

  getRecentJobs(): void {
    this.subs.sink = this.apiService.recentJobs().subscribe({
      next: (response: any) => {
        this.latestJob = response;
        this.totalJobs = this.latestJob.total_jobs;
        this.allJobs = this.latestJob.jobs;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erreur lors du chargement des emplois récents', err);
      }
    });

  }
  onLoadingChanged(loading: boolean): void {
    this.isLoading = loading;
  }

  getSearchResult(data: any): void {
    this.jobResult = data;
    this.totalJobs = this.jobResult.total_jobs;
    this.allJobs = data.jobs;
    this.jobType = "All ";
    this.isJobResult = true;
  }

  pageChanged(event: any): void {
    console.log(event);
    this.currentPage = event;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.adjustLoaderSize();
  }

  adjustLoaderSize(): void {
    const loader = document.querySelector('.loading-overlay') as HTMLElement;
    if (loader) {
      loader.style.width = `${window.innerWidth}px`;
      loader.style.height = `${window.innerHeight}px`;
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
