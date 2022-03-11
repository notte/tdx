export interface IBikeRouteResponse {
  RouteName: string;
  AuthorityName: string;
  CityCode: string;
  City: string;
  Town: string;
  RoadSectionStart: string;
  RoadSectionEnd: string;
  Direction: string;
  CyclingLength: number;
  FinishedTime: string;
  UpdateTime: string;
  Geometry: string;
  GeometryArray?: number[];
}
