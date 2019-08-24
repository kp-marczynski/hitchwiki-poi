export interface IPlaceInfo {
  id: number;
  lat: number;
  lon: number;
  rating: number;
  kml: Element;
}

export class PlaceInfo implements IPlaceInfo {
  constructor(
    public id: number,
    public lat: number,
    public lon: number,
    public rating: number
  ) {
  }

  kml: Element;
}
