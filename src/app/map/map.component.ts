import {AfterViewInit, Component, ChangeDetectorRef, Input} from '@angular/core';
import 'ol/ol.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {
    defaults as defaultControls,
    Attribution,
    FullScreen,
    ScaleLine,
    ZoomToExtent
} from 'ol/control.js';
import {
    defaults as defaultInteractions,
    DragRotateAndZoom
} from 'ol/interaction.js';
import {fromLonLat} from 'ol/proj.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import TileWMS from 'ol/source/TileWMS.js';
import Vector from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import KML from 'ol/format/KML.js';
import Geolocation from 'ol/Geolocation';
import 'ol/ol.css';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {ICountry} from '../../model/country.model';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
    @Input() nearbyCountries: ICountry[];

    ngAfterViewInit() {
        setTimeout(() => {
            this.drawMap();
        });
    }

    drawMap() {
        const viewFromLonLat = new View({
            center: fromLonLat([17, 51]),
            zoom: 12
        });
        const geolocation = new Geolocation({
            // enableHighAccuracy must be set to true to have the heading value.
            trackingOptions: {
                enableHighAccuracy: true
            },
            projection: viewFromLonLat.getProjection()
        });
        geolocation.setTracking(true);

        const accuracyFeature = new Feature();
        geolocation.on('change:accuracyGeometry', () => {
            accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
        });

        const positionFeature = new Feature();
        positionFeature.setStyle(new Style({
            image: new CircleStyle({
                radius: 6,
                fill: new Fill({
                    color: '#3399CC'
                }),
                stroke: new Stroke({
                    color: '#fff',
                    width: 2
                })
            })
        }));
        let positionChanged = false;
        geolocation.on('change:position', () => {
            const coordinates = geolocation.getPosition();
            positionFeature.setGeometry(coordinates ?
                new Point(coordinates) : null);
            if (!positionChanged) {
                positionChanged = true;
                viewFromLonLat.setCenter(coordinates);
            }
        });

        const osmFrAttribution = `&copy; <a href='http://www.openstreetmap.org/copyright' rel='noreferrer'>OpenStreetMap</a>`;
        const mapObj = new Map({
            layers: [
                new TileLayer({
                    source: new OSM({
                        attributions: [osmFrAttribution]
                    })
                }),
                // new TileLayer({
                //   source: new TileWMS({
                //     url:
                //       'http://188.166.116.137:8080/geoserver/gwc/service/wms',
                //     crossOrigin: 'anonymous',
                //     params: {
                //       LAYERS: ['naturalearth:roads'],
                //       format: 'image/png',
                //       SRS: 'EPSG:900913'
                //     }
                //   }),
                //   opacity: 0.5,
                //   visible: true
                // }),
                new Vector({
                    source: new VectorSource({
                        features: [accuracyFeature, positionFeature]
                    })
                })
            ],
            controls: defaultControls({
                attribution: false
            }).extend([
                new Attribution({
                    collapsible: false
                }),
                new FullScreen(),
                new ScaleLine()
            ]),
            interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
            target: 'map',
            view: viewFromLonLat,
            controllers: {
                zoom: {
                    show: true
                },
                position: {
                    show: true,
                    precision: 2,
                    dictionary: {
                        copyCoordinates: 'Copy coordinates',
                        textCopied: 'Copied',
                        closeSnackbar: 'Close'
                    }
                },
                rotation: {
                    show: true,
                    dictionary: {
                        rotateToNorth: 'Rotate to North'
                    },
                    showTooltip: true
                }
            }
        });
        if (this.nearbyCountries) {
            this.nearbyCountries.forEach(country => {
                const vector = new Vector({
                    map: mapObj,
                    source: new VectorSource({
                        url: 'assets/kml/countries/' + country.name + '.kml',
                        format: new KML()
                    })
                });
            });
        }
    }
}
