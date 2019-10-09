import {IPlaceInfo} from "./place-info.model";

export interface ICountry {
  iso: string;
  name: string;
  numberOfPlaces: number;
  numberOfDownloadedPlaces: number;
  placesInfo: IPlaceInfo[];
  north: number;
  east: number;
  south: number;
  west: number;
}

export class Country implements ICountry {
  numberOfDownloadedPlaces: number;
  placesInfo: IPlaceInfo[];

  constructor(
    public iso: string,
    public name: string,
    public numberOfPlaces: number,
    public north: number, // longitude max
    public east: number, // latitude max
    public south: number, // longitude min
    public west: number // latitude min
  ) {
  }
}
