import {Router, ActivatedRoute} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TravelService } from 'app/travel.service';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit {

  interest =  [
    {name:"Bandstand",value:"bandstand"},
    {name:"Bird Hide",value:"bird_hide"},
    {name:"Bowling Alley",value:"bowling_alley"},
    {name:"Dance",value:"dance"},
    {name:"Dog Park",value:"dog_park"},
    {name:"Escape Game",value:"escape_game"},
    {name:"Firepit",value:"firepit"},
    {name:"Fishing",value:"fishing"},
    {name:"Fitness Centre",value:"fitness_centre"},
    {name:"Garden",value:"garden"},
    {name:"Golf Course",value:"golf_course"},
    {name:"Hackerspace",value:"hackerspace"},
    {name:"Horse Riding",value:"horse_riding"},
    {name:"Ice Rink",value:"ice_rink"},
    {name:"Nature Reserve",value:"nature_reserve"},
    {name:"Park",value:"park"},
    {name:"Picnic Table",value:"picnic_table"},
    {name:"Playground",value:"playground"},
    {name:"Sauna",value:"sauna"},
    {name:"Sports Hall",value:"sports_hall"},
    {name:"Stadium",value:"stadium"},
    {name:"Summer Camp",value:"summer_camp"},
    {name:"Swimming Area",value:"swimming_area"},
    {name:"Swimming Pool",value:"swimming_pool"},
    {name:"Tanning Salon",value:"tanning_salon"},
    {name:"Trampoline Park",value:"trampoline_park"},
    {name:"Water Park",value:"water_park"},
    {name:"Wildlife Hide",value:"wildlife_hide"},
    {name:"Alphine Hut",value:"alphine_hut"},
    {name:"Aquarium",value:"aquarium"},
    {name:"Artwork",value:"artwork"},
    {name:"Attraction",value:"attraction"},
    {name:"Gallery",value:"gallery"},
    {name:"Information",value:"information"},
    {name:"Museum",value:"museum"},
    {name:"Theme Park",value:"theme_park"},
    {name:"Viewpoint",value:"viewpoint"},
    {name:"Wilderness Hut",value:"wilderness_hut"},
    {name:"Zoo",value:"zoo"},
    {name:"Bar",value:"bar"},
    {name:"Biergarten",value:"biergarten"},
    {name:"Cafe",value:"cafe"},
    {name:"casino",value:"casino"},
    {name:"Fast Food",value:"fast_food"},
    {name:"Food Court",value:"food_court"},
    {name:"Ice Cream",value:"ice_cream"},
    {name:"Pub",value:"pub"},
    {name:"Restaurant",value:"restaurant"},
    {name:"Bicycle Rental",value:"bicycle_rental"},
    {name:"Boat Rental",value:"boat_rental"},
    {name:"Car Rental",value:"car_rental"},
]


  public template1 = "For "
  public template2 = "there are: "
  public pageData;
  public output = false ;
  public output2 = false ;
  public tracker =1 ;
  dataSource:any;
  dataSource2:any;
  interests_list:any
  toDisplay:any
  toDisplay2:any
  count = 0;
  showDistances =false;

  show2 = false;
  show3 = false;
  show4 = false;
  show5 = false;
  show6 = false;
  searching = false;

  generateResultText(){
    let d = {}
    let ac = {}
    var y = 'name'
    var desc = 'desc'
    console.log(this.results)
    for (let i = 0; i < this.results.length; i++) {
      if (this.results[i].city.value in d){
        console.log("pass")
      } else{
        d[this.results[i].city.value ] = {}
        d[this.results[i].city.value ]['interests'] = []
      }

      if( this.results[i].stay.value in d[this.results[i].city.value ]){
        console.log("pass")
      } else{
        d[this.results[i].city.value ][this.results[i].stay.value] = {}
        d[this.results[i].city.value ][this.results[i].stay.value]['street'] = this.results[i].street.value
        d[this.results[i].city.value ][this.results[i].stay.value]['number'] = this.results[i].housenumber.value
        d[this.results[i].city.value ][this.results[i].stay.value]['url'] = this.results[i].url.value
        d[this.results[i].city.value ][this.results[i].stay.value]['coordinates'] = this.results[i].coordinates.value
      }
        for (let x = 0; x < this.interests_list.length; x++) {
          y = y + (x+1)+''
          desc = desc+(x+1)+''
          console.log(y)
          if( d[this.results[i].city.value ]['interests'].indexOf(this.results[i][y].value) !== -1){
            console.log("pass")
          }

          else{
            d[this.results[i].city.value ]['interests'].push(this.results[i][y].value )
          }
          y = 'name'
        }

    }
    console.log(d)
    return d;
  }

  generateResultHousing(){
    let d = {}
    console.log(this.results)
    for (let i = 0; i < this.results.length; i++) {
      if (this.results[i].city.value in d){
        console.log("pass")
      } else{
        d[this.results[i].city.value ] = {}
      }
          if( this.results[i].stay.value in d[this.results[i].city.value ]){
            console.log("pass")
          } else{
            d[this.results[i].city.value ][this.results[i].stay.value] = {}
            d[this.results[i].city.value ][this.results[i].stay.value]['street'] = this.results[i].street.value
            d[this.results[i].city.value ][this.results[i].stay.value]['number'] = this.results[i].housenumber.value
            d[this.results[i].city.value ][this.results[i].stay.value]['coordinates'] = this.results[i].coordinates.value
          }


    }
    console.log(d)
    return d;
  }


  showInput(){
    if(this.show2){
      if(this.show3){
        if(this.show4){
         this.show5 = true
         this.count = 4

        } else{
          this.show4 = true
          this.count = 3
        }

      } else{
        this.show3 = true
        this.count = 2
      }

    } else{
      this.show2 = true
      this.count = 1
    }
  }

  resetInput(){
    this.show2 = false;
    this.show3 = false;
    this.show4 = false;
    this.show5 = false;
    this.interests_list = []
  }


  results:any

  checkoutForm = this.formBuilder.group({
    name: '',
    interest1: '',
    interest2: '',
    interest3: '',
    interest4: '',
    interest5: ''
  });

  columns$  = ["accommodation","interest","distance"]

  constructor(router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private travelService:TravelService) {

  }

  ngOnInit() {
    this.pageData = <any>this.route.snapshot.data;
    console.log(this.interest)

  }

  onSubmit(): void {

    this.interests_list = [this.checkoutForm.value.interest1,this.checkoutForm.value.interest2,this.checkoutForm.value.interest3,this.checkoutForm.value.interest4,this.checkoutForm.value.interest5]
    this.interests_list = this.interests_list.slice(0,this.count+1)
    console.log(this.interests_list)

    let request = { country: this.checkoutForm.value.name,
      tourism:this.interests_list
    }
    this.searching = true
    this.getData(request);
  }
onClick(coordinates:String):void{
  let request = { distance: 300,
    interests:this.interests_list,
    coord:coordinates
  }
  this.getInterests(request);
  console.log("end")
}

  private async getData(request:any){
    this.tracker = 1;
    this.results = await this.travelService.getResponse$(request).toPromise();
    if(Object.keys(this.results).length === 0){
      this.tracker = 3;
      this.output = false;
    } else{
      this.tracker = 1;
      this.output = true;
    }
    console.log( this.tracker)

    this.toDisplay = this.generateResultText()
    this.toDisplay2 = this.generateResultHousing()
    console.log(this.toDisplay2 )

    this.searching = false;
    this.checkoutForm.reset();
  }

  getDistanceTable(distances:any){
    console.log(distances)
    this.dataSource = new MatTableDataSource<any>(distances);
    this.showDistances = true
  }

  // getRankedResults(results){
  //   var hotels = []
  //   let request = { distance: 300,
  //     interests:this.interests_list,
  //     coord:coordinates
  //   }
  //   Object.keys(results).forEach( e =>{hotels = [];
  //     Object.keys(results[e]).forEach(
  //   es => {
  //     hotels.push(results[e][es])

  //   });console.log(this.travelService.getInterests_distances$(,))}
  //   )
  // }


  private async getInterests(request:any){
    this.results = await this.travelService.getInterests$(request).toPromise();

    this.output2= true;
    this.dataSource2 = new MatTableDataSource<any>(this.results);
  }
  COUNTRIES = {
    "AD": "Andorra",
    "AE": "United Arab Emirates",
    "AF": "Afghanistan",
    "AG": "Antigua and Barbuda",
    "AI": "Anguilla",
    "AL": "Albania",
    "AM": "Armenia",
    "AO": "Angola",
    "AQ": "Antarctica",
    "AR": "Argentina",
    "AS": "American Samoa",
    "AT": "Austria",
    "AU": "Australia",
    "AW": "Aruba",
    "AX": "Aland Islands",
    "AZ": "Azerbaijan",
    "BA": "Bosnia and Herzegovina",
    "BB": "Barbados",
    "BD": "Bangladesh",
    "BE": "Belgium",
    "BF": "Burkina Faso",
    "BG": "Bulgaria",
    "BH": "Bahrain",
    "BI": "Burundi",
    "BJ": "Benin",
    "BL": "Saint-Barthélemy",
    "BM": "Bermuda",
    "BN": "Brunei Darussalam",
    "BO": "Bolivia",
    "BQ": "Caribbean Netherlands",
    "BR": "Brazil",
    "BS": "Bahamas",
    "BT": "Bhutan",
    "BV": "Bouvet Island",
    "BW": "Botswana",
    "BY": "Belarus",
    "BZ": "Belize",
    "CA": "Canada",
    "CC": "Cocos (Keeling) Islands",
    "CD": "Democratic Republic of the Congo",
    "CF": "Centrafrican Republic",
    "CG": "Republic of the Congo",
    "CH": "Switzerland",
    "CI": "Côte d'Ivoire",
    "CK": "Cook Islands",
    "CL": "Chile",
    "CM": "Cameroon",
    "CN": "China",
    "CO": "Colombia",
    "CR": "Costa Rica",
    "CU": "Cuba",
    "CV": "Cabo Verde",
    "CW": "Curaçao",
    "CX": "Christmas Island",
    "CY": "Cyprus",
    "CZ": "Czech Republic",
    "DE": "Germany",
    "DJ": "Djibouti",
    "DK": "Denmark",
    "DM": "Dominica",
    "DO": "Dominican Republic",
    "DZ": "Algeria",
    "EC": "Ecuador",
    "EE": "Estonia",
    "EG": "Egypt",
    "EH": "Western Sahara",
    "ER": "Eritrea",
    "ES": "Spain",
    "ET": "Ethiopia",
    "FI": "Finland",
    "FJ": "Fiji",
    "FK": "Falkland Islands",
    "FM": "Micronesia (Federated States of)",
    "FO": "Faroe Islands",
    "FR": "France",
    "GA": "Gabon",
    "GB": "United Kingdom",
    "GD": "Grenada",
    "GE": "Georgia",
    "GF": "French Guiana",
    "GG": "Guernsey",
    "GH": "Ghana",
    "GI": "Gibraltar",
    "GL": "Greenland",
    "GM": "The Gambia",
    "GN": "Guinea",
    "GP": "Guadeloupe",
    "GQ": "Equatorial Guinea",
    "GR": "Greece",
    "GS": "South Georgia and the South Sandwich Islands",
    "GT": "Guatemala",
    "GU": "Guam",
    "GW": "Guinea Bissau",
    "GY": "Guyana",
    "HK": "Hong Kong (SAR of China)",
    "HM": "Heard Island and McDonald Islands",
    "HN": "Honduras",
    "HR": "Croatia",
    "HT": "Haiti",
    "HU": "Hungary",
    "ID": "Indonesia",
    "IE": "Ireland",
    "IL": "Israel",
    "IM": "Isle of Man",
    "IN": "India",
    "IO": "British Indian Ocean Territory",
    "IQ": "Iraq",
    "IR": "Iran",
    "IS": "Iceland",
    "IT": "Italy",
    "JE": "Jersey",
    "JM": "Jamaica",
    "JO": "Jordan",
    "JP": "Japan",
    "KE": "Kenya",
    "KG": "Kyrgyzstan",
    "KH": "Cambodia",
    "KI": "Kiribati",
    "KM": "Comores",
    "KN": "Saint Kitts and Nevis",
    "KP": "North Korea",
    "KR": "South Korea",
    "KW": "Kuwait",
    "KY": "Cayman Islands",
    "KZ": "Kazakhstan",
    "LA": "Laos",
    "LB": "Lebanon",
    "LC": "Saint Lucia",
    "LI": "Liechtenstein",
    "LK": "Sri Lanka",
    "LR": "Liberia",
    "LS": "Lesotho",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "LV": "Latvia",
    "LY": "Libya",
    "MA": "Morocco",
    "MC": "Monaco",
    "MD": "Moldova",
    "ME": "Montenegro",
    "MF": "Saint Martin (French part)",
    "MG": "Madagascar",
    "MH": "Marshall Islands",
    "MK": "North Macedonia",
    "ML": "Mali",
    "MM": "Myanmar",
    "MN": "Mongolia",
    "MO": "Macao (SAR of China)",
    "MP": "Northern Mariana Islands",
    "MQ": "Martinique",
    "MR": "Mauritania",
    "MS": "Montserrat",
    "MT": "Malta",
    "MU": "Mauritius",
    "MV": "Maldives",
    "MW": "Malawi",
    "MX": "Mexico",
    "MY": "Malaysia",
    "MZ": "Mozambique",
    "NA": "Namibia",
    "NC": "New Caledonia",
    "NE": "Niger",
    "NF": "Norfolk Island",
    "NG": "Nigeria",
    "NI": "Nicaragua",
    "NL": "The Netherlands",
    "NO": "Norway",
    "NP": "Nepal",
    "NR": "Nauru",
    "NU": "Niue",
    "NZ": "New Zealand",
    "OM": "Oman",
    "PA": "Panama",
    "PE": "Peru",
    "PF": "French Polynesia",
    "PG": "Papua New Guinea",
    "PH": "Philippines",
    "PK": "Pakistan",
    "PL": "Poland",
    "PM": "Saint Pierre and Miquelon",
    "PN": "Pitcairn",
    "PR": "Puerto Rico",
    "PS": "Palestinian Territory",
    "PT": "Portugal",
    "PW": "Palau",
    "PY": "Paraguay",
    "QA": "Qatar",
    "RE": "Reunion",
    "RO": "Romania",
    "RS": "Serbia",
    "RU": "Russia",
    "RW": "Rwanda",
    "SA": "Saudi Arabia",
    "SB": "Solomon Islands",
    "SC": "Seychelles",
    "SD": "Sudan",
    "SE": "Sweden",
    "SG": "Singapore",
    "SH": "Saint Helena",
    "SI": "Slovenia",
    "SJ": "Svalbard and Jan Mayen",
    "SK": "Slovakia",
    "SL": "Sierra Leone",
    "SM": "San Marino",
    "SN": "Sénégal",
    "SO": "Somalia",
    "SR": "Suriname",
    "ST": "São Tomé and Príncipe",
    "SS": "South Sudan",
    "SV": "El Salvador",
    "SX": "Saint Martin (Dutch part)",
    "SY": "Syria",
    "SZ": "eSwatini",
    "TC": "Turks and Caicos Islands",
    "TD": "Chad",
    "TF": "French Southern and Antarctic Lands",
    "TG": "Togo",
    "TH": "Thailand",
    "TJ": "Tajikistan",
    "TK": "Tokelau",
    "TL": "Timor-Leste",
    "TM": "Turkmenistan",
    "TN": "Tunisia",
    "TO": "Tonga",
    "TR": "Turkey",
    "TT": "Trinidad and Tobago",
    "TV": "Tuvalu",
    "TW": "Taiwan",
    "TZ": "Tanzania",
    "UA": "Ukraine",
    "UG": "Uganda",
    "UM": "United States Minor Outlying Islands",
    "US": "United States of America",
    "UY": "Uruguay",
    "UZ": "Uzbekistan",
    "VA": "City of the Vatican",
    "VC": "Saint Vincent and the Grenadines",
    "VE": "Venezuela",
    "VG": "British Virgin Islands",
    "VI": "United States Virgin Islands",
    "VN": "Vietnam",
    "VU": "Vanuatu",
    "WF": "Wallis and Futuna",
    "WS": "Samoa",
    "YE": "Yemen",
    "YT": "Mayotte",
    "ZA": "South Africa",
    "ZM": "Zambia",
    "ZW": "Zimbabwe",
}

}
