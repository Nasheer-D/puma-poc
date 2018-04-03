import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThingService } from '../../services/things.service';
import { HttpResponse } from '../../utils/web/models/HttpResponse';
import { Thing } from '../../models/Thing';

@Component({
  selector: 'app-things',
  templateUrl: './things.component.html',
  styleUrls: ['./things.component.css']
})
export class ThingsComponent implements OnInit {
  private things: Thing;

  public constructor( private router: Router,
                      private thingsService: ThingService) {
  }

  public ngOnInit() {
    this.thingsService.getAllThings().subscribe((things: HttpResponse) => {
      this.things = things.data;
    });
  }

  public goToThingDetals(thingID: string) {
    console.log(thingID);
    this.router.navigate(['/thing-details', thingID]);
  }
}
