import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TravelService } from '../travel.service';

@Component({
  selector: 'app-travel-options',
  templateUrl: './travel-options.component.html',
  styleUrls: ['./travel-options.component.scss']
})
export class TravelOptionsComponent implements OnInit {

  results:any

  checkoutForm = this.formBuilder.group({
    name: '',
    address: '',
    address2: '',
    address3: ''
  });

  constructor(
    private formBuilder: FormBuilder, private travelService:TravelService
  ) {}

  onSubmit(): void {
    // Process checkout data here
    console.warn('Your order has been submitted', this.checkoutForm.value);
    let request = { country: this.checkoutForm.value.name,
      tourism:[this.checkoutForm.value.address,this.checkoutForm.value.address2,this.checkoutForm.value.address3]

    }
    this.getData(request);
    console.log(this.results)

  }

  private async getData(request:any){
    this.results = await this.travelService.getResponse$(request).toPromise();
    console.log(this.results)
    this.checkoutForm.reset();
  }

  ngOnInit(): void {
  }

}
