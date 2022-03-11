export interface IPointList {
  // name: string;
  latitude: number;
  longitude: number;
  StationUID: string;
}

export interface IBikeRoutePointList {
  GeometryArray: number[];
  RouteName: string;
}

export interface ICityCenter {
  name: string;
  center: number[];
}
