import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../core/component/header/header.component';
import { NewlineReplaceBrPipe } from '../../../shared/pipes/newline-replace-br.pipe';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';
import { ApiCallService } from '../../../core/services/api/api-call.service';
import { TimeDiffPipe } from '../../../shared/pipes/time-diff.pipe';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [HeaderComponent, NewlineReplaceBrPipe, TimeDiffPipe],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.scss'
})
export class JobDetailsComponent implements OnInit {

  details: string = "Back yourself a new job!\n\nCombined with a history of more than 100 years, Gäubodenbäcker Hahn GmbH builds a bridge between tradition and future. Our employees have made us what we are today. That is why we treat each other at work with mutual appreciation and respectful cooperation. Flat hierarchies, lots of fun and joy in our daily work characterize our corporate culture.\n\nFor our specialist shop in Eichendorf, we are now looking for bakery salespeople (m/f/d) with a heart, skilled or unskilled\nfull-time, part-time or on a mini-job basis.\n\nYour tasks...\n\n* You sell our freshly baked goods in specialist shops: you advise and serve our customers warmly and competently\n* You collect with our modern cash register system\n* You bake fresh rolls throughout the day, prepare delicious snacks and coffee specialties and ensure that the goods are presented in an appealing way\n* You pay attention to the implementation of hygiene regulations and company standards, because our customers appreciate the usual and consistent quality\n\nYour recipe for our and your success...\n\n* You are outgoing, have a passion for sales and your teammates appreciate your commitment\n* Your knowledge as a salesperson will make it easier for you to get started, but you can also start your career in the bakery with us as a career changer\n* You love baked goods in all their variety\n* A well-groomed appearance is important to you\n* Changing working hours (shift work, Sunday work and public holiday work) are not a problem for you\n\nThis awaits you...\n\n* a pleasant working atmosphere\n* an individual training\n* a secure job in a progressive family business\n* 50% staff discount on all our bread and baked goods\n* Bonus payment \"\"Employees refer employees\n* Gifts on special occasions\n* Attractive bonuses for night and Sunday work\n\nWe look forward to you applying preferably online on our career portal using the following link https://gaeubodenbaecker.softgarden.io/de/vacancies\n\nAlternatively, you can send us your application by email or post.\n\nGäubodenbacker Hahn GmbH\nHadersbacher Strasse 18b\n93444 Hostage Listening\njobs@gaeubodenbaecker.de\nTel: 09423-9418 0\"|Specialist salesperson - food craft (bakery)";
  jobIDRoute: string = "";
  subs = new SubSink();
  job: any;

  constructor(private route: ActivatedRoute,
    private apiService: ApiCallService
  ) {
    const routeParams = this.route.snapshot.paramMap;
    this.jobIDRoute = String(routeParams.get('id'));
    console.log(this.jobIDRoute, 'routes')
  }

  ngOnInit(): void {
      this.getJobDetails(this.jobIDRoute);
  }

  getJobDetails(id: string): void {
    this.subs.sink = this.apiService.getJobDetails(id).subscribe((res: any) => {
      this.job = res;
      console.log(res, "res")
    })
  }

}
