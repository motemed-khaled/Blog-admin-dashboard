import { Component, OnInit } from '@angular/core';
import { SubscriberService } from '../service/subscriber.service';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.css']
})
export class SubscribersComponent implements OnInit {
  subscriberArray!: any;
  constructor(private subService: SubscriberService) { }

  ngOnInit(): void {
    this.subService.loadData().subscribe({
      next: (val) => {
        this.subscriberArray = val;
        console.log(this.subscriberArray)
      }
    })
  }

  onDelete(id: string , name:string): void{
    if (confirm(`Are You Sure To Delete this Subscriber : ${name}`)) {
      this.subService.deleteOne(id);
    }
  }
}
