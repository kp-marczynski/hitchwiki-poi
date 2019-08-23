import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Country, ICountry} from "../model/country.model";
import {PlaceInfo, IPlaceInfo} from "../model/place-info.model";
import {filter, map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'hitchwiki-poi';
  corsUrl = '';
  countries: Country[];
  parser = new DOMParser();

  constructor(protected http: HttpClient) {
  }

  ngOnInit(): void {
    this.getAllCountries();
  }

  public downloadCountryKmlFile(country: ICountry) {
    if (country.numberOfDownloadedPlaces && country.numberOfDownloadedPlaces === country.numberOfPlaces) {
      this.saveToFile(country).then();
    } else {
      this.getPlacesInCountry(country).then();
    }
  }

  public downloadAll(index: number) {
    if (index < this.countries.length) {
      this.getPlacesInCountry(this.countries[index]).then(() => this.downloadAll(index + 1));
    }
  }

  private getAllCountries() {
    this.http.get(this.getUrl('countries', 'json'), {observe: 'response'}).subscribe(res => {
      this.countries = [];
      for (const country in res.body) {
        this.countries.push(new Country(res.body[country].iso, res.body[country].name, parseInt(res.body[country].places)));
      }
    });
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
          for (const place of country.placesInfo) {
            this.getPlaceKml(place, 1).then(() => {
              country.numberOfDownloadedPlaces++;
              if (country.numberOfDownloadedPlaces === country.numberOfPlaces) {
                this.saveToFile(country);
                resolve();
              }
            })
          }
        });
    });
  }

  private getPlaceKml(place: IPlaceInfo, tryNumber: number): Promise<any> {
    if (tryNumber > 1) {
      console.log(tryNumber + ': ' + place.id);
    }
    if (tryNumber > 10) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      this.getPlaceKmlLoop(place).then(() => resolve()).catch(() => this.getPlaceKml(place, tryNumber + 1).then(() => resolve()));
    })
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
    return this.corsUrl + 'https://hitchwiki.org/maps/api/?format=' + format + '&' + resourcePath;
  }

  private getKmlTemplate(): Promise<string> {
    return this.http.get('assets/kmlTemplate.kml', {responseType: 'text'}).toPromise();
  }

  private saveToFile(country: ICountry): Promise<any> {
    return new Promise((resolve, reject) => {
      // console.log('saving to file');
      const filename = country.name + ".kml";
      this.createKmlBlob(country).then(kmlBlob => {
        const a = document.createElement('a');
        a.download = filename;
        a.href = window.URL.createObjectURL(kmlBlob);
        a.dataset.downloadurl = ['application/vnd.google-earth.kml+xml', a.download, a.href].join(':');
        a.click();
        resolve();
      });
    });
  }

  private createKmlBlob(country: ICountry): Promise<Blob> {
    return new Promise((resolve, reject) => {
        this.getKmlTemplate().then(result => {
          let kmlTemplate = this.parseXml(result);
          kmlTemplate.getElementsByTagName("name")[0].childNodes[0].nodeValue = country.name;
          for (let placeInfo of country.placesInfo) {
            kmlTemplate.getElementsByTagName("Document")[0].appendChild(placeInfo.kml);
          }
          resolve(new Blob([new XMLSerializer().serializeToString(kmlTemplate)], {type: 'application/vnd.google-earth.kml+xml'}));
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
}
