import {IPlaceInfo} from "./place-info.model";

export interface ICountry {
  iso: string;
  name: string;
  numberOfPlaces: number;
  numberOfDownloadedPlaces: number;
  placesInfo: IPlaceInfo[];
}

export class Country implements ICountry {
  numberOfDownloadedPlaces: number;
  placesInfo: IPlaceInfo[];

  constructor(
    public iso: string,
    public name: string,
    public numberOfPlaces: number,
  ) {
  }
}
