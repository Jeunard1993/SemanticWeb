import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TravelService } from 'app/travel.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-recommedation',
  templateUrl: './recommedation.component.html',
  styleUrls: ['./recommedation.component.css']
})

export class RecommedationComponent implements OnInit,AfterViewInit {
  @Input() value = Object;
  @Input() city = '';
  text = ''
  text2 = ' Available accommodations:<br/>';
  text_arr = []
  results = []
  isDataAvailable = false
  localData ={}
  hotel = {}
  @Output() distanceResults = new EventEmitter<any>();

  constructor(private travelService:TravelService, private sanitized: DomSanitizer) { }
  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    console.log(this.value)
    // if(this.value['interests'].length > 0){
    //   this.text = 'Based on your given interest we recommend you go and visit '+this.city+'.  This city has areas that match your interest, which were the following: <br/>'
    //   for (let i = 0; i < this.value['interests'].length; i++){
    //     if(i+1 === this.value['interests'].length){
    //       this.text = this.text +this.value['interests'][i]+" - "+this.getDescription(this.value['interests'][i]) +". ";
    //     } else{
    //       this.text = this.text +this.value['interests'][i]+" - "+this.getDescription(this.value['interests'][i])+". <br/>";
    //     }
    //   }
    // }
    if(this.value['interests']){
      this.getDescription(this.value['interests']);
      this.getHotel();
    }
    console.log("this is it")
    console.log(this.value)


    for (let key in this.value){
      if(key !== 'interests'){
        //this.text2 =this.text2+"<br/>"+"<a href='"+this.value[key]['url']+"'>"+"-"+ key +"</a>"+ " located at "+this.value[key]['street']+" "+this.value[key]['number']+" <br/>"
       // this.text2= this.text2 + "<button>ddddd</button>"
       this.text_arr.push()
      }

    }


  }

  private async getHotel(){
    var hotels = []
    Object.keys(this.value).forEach(e => {if(e!="interests"){
      hotels.push(e)

    };});
    console.log(hotels)
    for(let i = 0; i < this.value['interests'].length; i++){
      let request = { interest: this.value['interests'][i],
        hotels:hotels

      }
      var results = await this.travelService.getNearestHotel$(request).toPromise();

      this.hotel[this.value['interests'][i]]= results[0].label.value;

    }
    console.log("results2")
    console.log(hotels)
  }
   private async getDescription(interests:any){
    for(let i = 0; i < this.value['interests'].length; i++){
      let request = { name: interests[i],

      }
      var description = await this.travelService.getDescriptions$(request).toPromise();
      if(description.length >0){
        this.localData[interests[i]] = description[0].desc.value;
      } else{
        this.localData[interests[i]] = "";
      }


    }
  }


  onClick(hotel:any,interests:any):void{
    let request = { name: hotel,
      interests:interests
    }
    console.log(request)
    this.getInterests(request);
  }

  parseResults(hotel:any,interests:any){
    let res = []
    let op = {}
    let distance = 'distance'
    let new_distance = ''
    for (let i = 0; i < interests.length; i++) {
      new_distance = distance + (i+1)
      op["distance"] = this.results[0][new_distance]
      op["interest"] = interests[i]
      op["accommodation"] = hotel
      res.push(op)
    }
    return res

  }


  private async getInterests(request:any){
    this.results = await this.travelService.getInterests$(request).toPromise();

    let res = []
    let op = {}
    let distance = 'distance'
    let new_distance = ''
    console.log(request.interests)
    for (let i = 0; i < request.interests.length; i++) {
      console.log(request.interests[i])
      new_distance = distance + (i+1)
      op["distance"] = this.results[0][new_distance].value
      op["interest"] = request.interests[i]
      op["accommodation"] = request.name
      res.push(op)
      op = {}
    }
    console.log(this.results)
    this.results = res
    this.distanceResults.emit(res);

    //this.output2= true;
    //this.dataSource2 = new MatTableDataSource<any>(this.results);
  }

}
