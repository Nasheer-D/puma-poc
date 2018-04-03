import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ThingService } from '../../services/things.service';
import { HttpResponse } from '../../utils/web/models/HttpResponse';
import { Thing } from '../../models/Thing';

@Component({
  selector: 'app-thing-details',
  templateUrl: './thing-details.component.html',
  styleUrls: ['./thing-details.component.css']
})
export class ThingDetailsComponent implements OnInit {
  private routerSubscription: Subscription;
  private thing: Thing = <Thing>{};

  public constructor(private route: ActivatedRoute,
    private thingsService: ThingService) { }

  public ngOnInit() {
    this.routerSubscription = this.route.params.subscribe(params => {
      const thingIDFromParams = params['thingID'];

      this.thingsService.getThingByID(thingIDFromParams).subscribe((thing: HttpResponse) => {
        this.thing = thing.data[0];
      });
    });
  }
}
