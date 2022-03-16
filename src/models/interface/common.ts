export interface IPointList {
  latitude: number;
  longitude: number;
  StationUID: string;
}

export interface IOtherPointList {
  name: string;
  latitude: number;
  longitude: number;
  address: string | undefined;
  opentime?: string;
  phone?: string;
}

export interface IBikeRoutePointList {
  GeometryArray: number[];
  RouteName: string;
}

export interface ICityCenter {
  name: string;
  center: number[];
}
