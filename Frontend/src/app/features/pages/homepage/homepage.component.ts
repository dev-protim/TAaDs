import { Component, OnInit, HostListener } from '@angular/core';
import { ApiCallService } from '../../../core/services/api/api-call.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SubSink } from 'subsink';
import { Job } from '../../../core/models/job';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, ReactiveFormsModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  providers: [ApiCallService]
})
export class HomepageComponent implements OnInit {

  subs = new SubSink();
  myForm = this.fb.group({
    message: ['']
  })
  response: any = "";
  isGeneration: boolean = false;

  constructor(public apiService: ApiCallService, 
    private http: HttpClient,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    // this.response = "<h1>Learning Path for Full-Stack Developer</h1>\n\n<h2>Disclaimer:</h2>\n<p>We are missing a direct course that covers full-stack development. However, we can create a hypothetical learning path using related courses.</p>\n\n<h3>Prerequisites</h3>\n<ul>\n  <li><strong>Fundamentals in Information Retrieval (IR)</strong>: This course teaches essential concepts and methods of IR, which can be beneficial for a full-stack developer who needs to design search engines.</li>\n  <li><strong>Agile Software Development</strong>: Although this course focuses on project management, it provides knowledge on tools supporting agile project management, which is also relevant for full-stack development.</li>\n</ul>\n\n<h3>Core Courses for Full-Stack Developer</h3>\n<ul>\n  <li><strong>Text Mining and Search</strong>: This course covers content analysis in texts and the design of search engines, which can be applied to a full-stack developer's work.</li>\n  <li><strong>Agile Software Development (continued)</strong>: As previously mentioned, this course teaches Agile methodologies and frameworks that are useful for managing projects related to full-stack development.</li>\n</ul>\n\n<h3>Additional Courses for Holistic Knowledge</h3>\n<ul>\n  <li><strong>Master Applied Computer Science</strong>: This is a general master's program that provides comprehensive knowledge in computer science, which can complement the learning path for a full-stack developer.</li>\n</ul>\n\n<p><strong>Note:</strong> The suggested learning path may not cover all aspects of full-stack development. Additional courses or certifications might be necessary to achieve a deep understanding of this field.</p>\n\n<h3>Suggested Learning Path Timeline</h3>\n<table border=\"1\">\n  <tr>\n    <th>Course</th>\n    <th>Durations (in hours)</th>\n    <th>Timeline</th>\n  </tr>\n  <tr>\n    <td>Fundamentals in Information Retrieval (IR)</td>\n    <td>Total: 180, Lecture: 45, Self-study: 135</td>\n    <td>First Semester</td>\n  </tr>\n  <tr>\n    <td>Agile Software Development</td>\n    <td>Total: 180, Lecture: 45, Self-study: 135</td>\n    <td>First Semester</td>\n  </tr>\n  <tr>\n    <td>Text Mining and Search</td>\n    <td>Total: 150, Attendance: 60, Self-study: 20, Practical work: 70</td>\n    <td>Second Semester</td>\n  </tr>\n</table>\n\n<p><strong>Disclaimer:</strong> This suggested learning path is based on hypothetical connections between courses and may not accurately represent the most efficient or effective way to become a full-stack developer.</p>"
  }

  submit(): void {
    this.isGeneration = true;
    this.response = "";
    let data = {
      query: this.myForm.value.message,
    }
    
    this.subs.sink = this.apiService.generateResponse(data).subscribe((res: any) => {
      this.response = res.response;
      // this.response = this.response.replace(/(?<! )\n(?! )/g, '<br>');;
      // this.response = this.response.replace(/\n/g, '<br>');
      // this.response = this.response.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
      this.isGeneration = false;
    })
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
