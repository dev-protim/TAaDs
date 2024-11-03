import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TimeDiffPipe } from '../../../shared/pipes/time-diff.pipe';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [RouterLink, CommonModule, TimeDiffPipe],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.scss'
})
export class JobCardComponent {

  // @Input() route: any;
  @Input() job: any;
}
