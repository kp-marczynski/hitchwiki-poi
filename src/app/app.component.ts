import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Country, ICountry} from "../model/country.model";
import {IPlaceInfo, PlaceInfo} from "../model/place-info.model";
import {filter, map} from 'rxjs/operators';
import {FormBuilder} from "@angular/forms";
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  faMapMarkerAlt = faMapMarkerAlt;
  countries: ICountry[];
  parser = new DOMParser();
  searchCountry = '';
  searchCountries: ICountry[];
  corsForm = this.fb.group({
    url: [''],
  });

  constructor(protected http: HttpClient, protected fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.getAllCountries();
  }

  public downloadCountryKmlFile(country: ICountry) {
    if (country.numberOfDownloadedPlaces && country.numberOfDownloadedPlaces === country.numberOfPlaces) {
      this.prepareKmlString(country).then(kmlString => {
        this.saveToFile(country.name, kmlString);
      });
    } else {
      this.getPlacesInCountry(country).then().catch(() => this.downloadKmlFromAssets(country));
    }
  }

  public downloadAll(index: number) {
    if (index < this.countries.length) {
      this.getPlacesInCountry(this.countries[index])
        .then(() => this.downloadAll(index + 1))
        .catch(() => this.downloadKmlFromAssets(this.countries[index]).then(() => this.downloadAll(index + 1)));
    }
  }

  private getAllCountries() {
    this.http.get(this.getUrl('countries', 'json'), {observe: 'response'}).subscribe(res => {
      this.populateCountriesArray(res.body);
    }, () => {
      this.http.get('assets/countries.json').subscribe(res => {
        this.populateCountriesArray(res);
      })
    });
  }

  private populateCountriesArray(receivedCountries: any) {
    this.countries = [];
    for (const country in receivedCountries) {
      this.countries.push(new Country(receivedCountries[country].iso, receivedCountries[country].name, parseInt(receivedCountries[country].places)));
    }
    this.searchCountries = this.countries;
  }


  private getPlacesInCountry(country: ICountry): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<PlaceInfo[]>(this.getUrl('country=' + country.iso, 'json'), {observe: 'response'})
        .pipe(
          filter((res: HttpResponse<IPlaceInfo[]>) => res.ok),
          map((res: HttpResponse<IPlaceInfo[]>) => res.body))
        .subscribe((res: IPlaceInfo[]) => {
          country.placesInfo = res;
          country.numberOfDownloadedPlaces = 0;
          // console.log(country);
          for (let placeIndex = 0; placeIndex < country.placesInfo.length; ++placeIndex) {
            this.getPlaceKml(country, placeIndex, 1).then(() => {
              country.numberOfDownloadedPlaces++;
              if (country.numberOfDownloadedPlaces === country.numberOfPlaces) {
                this.prepareKmlString(country).then(kmlString => {
                  this.saveToFile(country.name, kmlString);
                  resolve();
                });
              }
            });
          }
        }, () => reject());
    });
  }

  private getPlaceKml(country: ICountry, placeIndex: number, tryNumber: number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (placeIndex > country.numberOfDownloadedPlaces + 100) {
        setTimeout(() => this.getPlaceKml(country, placeIndex, tryNumber).then(() => resolve()), 100);
      } else {
        const place = country.placesInfo[placeIndex];
        if (tryNumber > 1) {
          console.log(tryNumber + ': ' + place.id);
        }
        if (tryNumber > 10) {
          reject();
        } else {
          this.getPlaceKmlLoop(place).then(() => resolve()).catch(() => this.getPlaceKml(country, placeIndex, tryNumber + 1).then(() => resolve()));
        }
      }
    });
  }

  private getPlaceKmlLoop(place: IPlaceInfo): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.getUrl('place=' + place.id, 'kml'), {responseType: 'text'}).subscribe((res) => {
        try {
          const somePlace = this.parseXml(res).getElementsByTagName("Placemark")[0];
          this.replaceStyleUrl(somePlace.getElementsByTagName("styleUrl")[0].childNodes[0]);
          place.kml = somePlace;
          // console.log(somePlace);

          resolve();
        } catch (e) {
          reject();
        }
      });
    })
  }

  private getUrl(resourcePath: string, format: string) {
    let url = 'https://hitchwiki.org/maps/api/?format=' + format + '&' + resourcePath;
    const corsUrl = this.corsForm.get('url').value;
    if (corsUrl && corsUrl.trim() != '') {
      return corsUrl + encodeURIComponent(url);
    }
    return url;
  }

  private getKmlTemplate(): Promise<string> {
    return this.http.get('assets/kmlTemplate.kml', {responseType: 'text'}).toPromise();
  }

  private getKmlFromAssets(country: ICountry): Promise<string> {
    return this.http.get('assets/kml/countries/' + country.name + '.kml', {responseType: 'text'}).toPromise();
  }

  private saveToFile(filename: string, kmlString: string) {
    // console.log('saving to file');
    const kmlBlob = new Blob([kmlString], {type: 'application/vnd.google-earth.kml+xml'});
    const a = document.createElement('a');
    a.download = filename + '.kml';
    a.href = window.URL.createObjectURL(kmlBlob);
    a.dataset.downloadurl = ['application/vnd.google-earth.kml+xml', a.download, a.href].join(':');
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  private downloadKmlFromAssets(country: ICountry): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getKmlFromAssets(country).then(kmlString => {
        this.saveToFile(country.name, kmlString);
        resolve();
      });
    });
  }

  private prepareKmlString(country: ICountry): Promise<any> {
    return new Promise((resolve, reject) => {
        this.getKmlTemplate().then(result => {
          let kmlTemplate = this.parseXml(result);
          kmlTemplate.getElementsByTagName("name")[0].childNodes[0].nodeValue = country.name;
          for (let placeInfo of country.placesInfo) {
            kmlTemplate.getElementsByTagName("Document")[0].appendChild(placeInfo.kml);
          }
          resolve(new XMLSerializer().serializeToString(kmlTemplate));
        });
      }
    )
  }

  private replaceStyleUrl(styleUrl) {
    switch (styleUrl.nodeValue) {
      case "#rating_0":
        styleUrl.nodeValue = "#placemark-purple";
        break;
      case "#rating_1":
        styleUrl.nodeValue = "#placemark-green";
        break;
      case "#rating_2":
        styleUrl.nodeValue = "#placemark-blue";
        break;
      case "#rating_3":
        styleUrl.nodeValue = "#placemark-yellow";
        break;
      case "#rating_4":
        styleUrl.nodeValue = "#placemark-orange";
        break;
      case "#rating_5":
        styleUrl.nodeValue = "#placemark-red";
        break;
      default:
        styleUrl.nodeValue = "#placemark-brown";
        break;
    }
  }

  private parseXml(xmlString: string) {
    return this.parser.parseFromString(xmlString, "text/xml");
  }

  searchMatchingCountries() {
    const searchTemp = this.searchCountry.trim().toLocaleLowerCase();
    this.searchCountries = searchTemp == '' ? this.countries : this.countries.filter(country => country.name.toLocaleLowerCase().includes(searchTemp));
  }
}
