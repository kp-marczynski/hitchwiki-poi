import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Country, ICountry} from '../../model/country.model';
import {IPlaceInfo, PlaceInfo} from '../../model/place-info.model';
import {filter, map} from 'rxjs/operators';
import {FormBuilder} from '@angular/forms';
import {faDownload, faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';
import {saveAs} from 'file-saver';
import {version} from '../../../package.json';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    static readonly NUMBER_OF_RETRIES = 5;
    static readonly NUMBER_OF_CONCURRENT_QUERIES = 100;
    public readonly VERSION: string = version;
    faMapMarkerAlt = faMapMarkerAlt;
    faDownload = faDownload;
    countries: ICountry[];
    parser = new DOMParser();
    searchCountry = '';
    searchCountries: ICountry[];
    nearbyCountries: ICountry[] = [];
    searchNearby = true;

    currentLongitude: number;
    currentLatitude: number;

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
            this.getPlacesInCountry(country).catch(() => this.downloadKmlFromAssets(country));
        }
    }

    public downloadAll(index: number) {
        if (index < this.countries.length) {
            this.getPlacesInCountry(this.countries[index])
                .then(() => this.downloadAll(index + 1))
                .catch(() => {
                    this.downloadKmlFromAssets(this.countries[index])
                        .then(() => this.downloadAll(index + 1));
                });
        } else {
            this.saveCountriesJsonFile();
        }
    }

    private getAllCountries() {
        this.http.get(this.getUrl('countries', 'json'), {observe: 'response'}).subscribe(res => {
            this.populateCountriesArray(res.body);
        }, () => {
            this.http.get('assets/countries.json').subscribe(res => {
                this.populateCountriesArray(res);
            });
        });
    }

    private populateCountriesArray(receivedCountries: any) {
        this.countries = [];
        for (const country in receivedCountries) {
            if (receivedCountries.hasOwnProperty(country)) {
                this.countries.push(
                    new Country(receivedCountries[country].iso,
                        receivedCountries[country].name,
                        parseInt(receivedCountries[country].places, 10),
                        parseFloat(receivedCountries[country].north),
                        parseFloat(receivedCountries[country].east),
                        parseFloat(receivedCountries[country].south),
                        parseFloat(receivedCountries[country].west)));
            }
        }
        this.searchCountries = this.countries;
        this.populateNearbyCountriesArray();
    }

    private populateNearbyCountriesArray() {
        new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        }).then((position: any) => {
            this.currentLongitude = position.coords.longitude;
            this.currentLatitude = position.coords.latitude;
            this.nearbyCountries = this.countries.filter(country =>
                country.north + 4 >= this.currentLongitude
                && country.south - 4 <= this.currentLongitude
                && country.east + 2 >= this.currentLatitude
                && country.west - 2 <= this.currentLatitude);
            if (this.nearbyCountries && this.nearbyCountries.length > 0 && this.searchNearby) {
                this.searchCountries = this.nearbyCountries;
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
                    // this.calculateCountryExtremePoints(country);
                    // resolve();
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
                        }).catch(() => reject());
                    }
                }, () => reject());
        });
    }

    private calculateCountryExtremePoints(country: ICountry) {
        if (this.hasExtremes(country)) {
            const lonArray = country.placesInfo.map(elem => elem.lon);
            const latArray = country.placesInfo.map(elem => elem.lat);

            country.north = Math.max(...lonArray);
            country.east = Math.max(...latArray);
            country.south = Math.min(...lonArray);
            country.west = Math.min(...latArray);
        }
    }

    private hasExtremes(country: ICountry): boolean {
        return !country.north || !country.south || !country.east || !country.west;
    }

    private saveCountriesJsonFile() {
        // console.log('saving to file');
        this.countries.forEach(elem => {
            elem.numberOfDownloadedPlaces = undefined;
            elem.placesInfo = undefined;
        });
        const countriesString = JSON.stringify(this.countries);
        const contentBlob = new Blob([countriesString], {type: 'application/json'});
        saveAs(contentBlob, 'countries.json');
    }

    private countryJsonReplacer(key, value) {
        if (key === 'numberOfDownloadedPlaces') {
            return undefined;
        } else if (key === 'placesInfo') {
            return undefined;
        }
    }

    private getPlaceKml(country: ICountry, placeIndex: number, tryNumber: number): Promise<any> {
        return new Promise((resolve, reject) => {
            if (placeIndex > country.numberOfDownloadedPlaces + HomePage.NUMBER_OF_CONCURRENT_QUERIES) {
                setTimeout(() => {
                    this.getPlaceKml(country, placeIndex, tryNumber)
                        .then(() => resolve())
                        .catch(() => reject());
                }, 100);
            } else {
                const place = country.placesInfo[placeIndex];
                if (tryNumber > 1) {
                    console.log('Retry ' + tryNumber + ': ' + place.id);
                }
                if (tryNumber > HomePage.NUMBER_OF_RETRIES) {
                    reject();
                } else {
                    this.getPlaceKmlLoop(place)
                        .then(() => resolve())
                        .catch(() => {
                            this.getPlaceKml(country, placeIndex, tryNumber + 1)
                                .then(() => resolve())
                                .catch(() => reject());
                        })
                    ;
                }
            }
        });
    }

    private getPlaceKmlLoop(place: IPlaceInfo): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.getUrl('place=' + place.id, 'kml'), {responseType: 'text'}).subscribe((res) => {
                try {
                    const somePlace = this.parseXml(res).getElementsByTagName('Placemark')[0];
                    this.replaceStyleUrl(somePlace.getElementsByTagName('styleUrl')[0].childNodes[0]);
                    place.kml = somePlace;
                    // console.log(somePlace);

                    resolve();
                } catch (e) {
                    reject();
                }
            }, () => reject());
        });
    }

    private getUrl(resourcePath: string, format: string) {
        const url = 'https://hitchwiki.org/maps/api/?format=' + format + '&' + resourcePath;
        const corsUrl = this.corsForm.get('url').value;
        if (corsUrl && corsUrl.trim() !== '') {
            return corsUrl + encodeURIComponent(url);
        }
        return url;
    }

    private getKmlTemplate(): Promise<string> {
        return this.http.get('assets/kmlTemplate.kml', {responseType: 'text'}).toPromise();
    }

    private saveToFile(filename: string, kmlString: string) {
        // console.log('saving to file');
        const kmlBlob = new Blob([kmlString], {type: 'application/vnd.google-earth.kml+xml'});
        saveAs(kmlBlob, filename + '.kml');
    }

    private downloadKmlFromAssets(country: ICountry): Promise<any> {
        this.addCountryToNearbyCountries(country);
        return new Promise((resolve, reject) => {
            country.numberOfDownloadedPlaces = 0;
            country.placesInfo = undefined;
            const a = document.createElement('a');
            const filename = country.name + '.kml';
            a.download = filename;
            a.href = 'assets/kml/countries/' + filename;
            const mimetype = 'application/vnd.google-earth.kml+xml';
            a.dataset.downloadurl = [mimetype, a.download, a.href].join(':');
            a.type = mimetype;
            a.target = '_self';
            document.body.appendChild(a);
            a.click();
            a.remove();
            resolve();
        });
    }

    private addCountryToNearbyCountries(country: ICountry) {
        if (!this.nearbyCountries.find(elem => elem.iso === country.iso)) {
            this.nearbyCountries.push(country);
        }
    }

    private prepareKmlString(country: ICountry): Promise<any> {
        this.addCountryToNearbyCountries(country);
        return new Promise((resolve, reject) => {
                this.getKmlTemplate().then(result => {
                    result = result.replace(/https/g, 'http');
                    const kmlTemplate = this.parseXml(result);
                    kmlTemplate.getElementsByTagName('name')[0].childNodes[0].nodeValue = country.name;
                    for (const placeInfo of country.placesInfo) {
                        kmlTemplate.getElementById('placemark-root').appendChild(placeInfo.kml);
                    }
                    resolve(new XMLSerializer().serializeToString(kmlTemplate));
                });
            }
        );
    }

    private replaceStyleUrl(styleUrl) {
        switch (styleUrl.nodeValue) {
            case '#rating_0':
                styleUrl.nodeValue = '#placemark-purple';
                break;
            case '#rating_1':
                styleUrl.nodeValue = '#placemark-green';
                break;
            case '#rating_2':
                styleUrl.nodeValue = '#placemark-blue';
                break;
            case '#rating_3':
                styleUrl.nodeValue = '#placemark-yellow';
                break;
            case '#rating_4':
                styleUrl.nodeValue = '#placemark-orange';
                break;
            case '#rating_5':
                styleUrl.nodeValue = '#placemark-red';
                break;
            default:
                styleUrl.nodeValue = '#placemark-brown';
                break;
        }
    }

    private parseXml(xmlString: string) {
        return this.parser.parseFromString(xmlString, 'text/xml');
    }

    searchMatchingCountries() {
        const searchTemp = this.searchCountry.trim().toLocaleLowerCase();
        const countries = this.searchNearby && this.nearbyCountries ? this.nearbyCountries : this.countries;

        this.searchCountries = searchTemp === ''
            ? countries
            : countries.filter(country => country.name.toLocaleLowerCase().includes(searchTemp));
    }
}
